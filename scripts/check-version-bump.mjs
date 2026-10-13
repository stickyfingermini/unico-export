import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const baseRef = process.env.GITHUB_BASE_REF;
if (!baseRef) {
  console.error('GITHUB_BASE_REF is required; run this checker from a pull request workflow.');
  process.exit(2);
}

const base = `origin/${baseRef}`;
const changedFiles = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { encoding: 'utf8' })
  .split(/\r?\n/u)
  .filter(Boolean);
const behaviorFiles = changedFiles.filter((file) => (
  file === 'SKILL.md'
  || file === 'open-design.json'
  || file.startsWith('compiler/')
  || file.startsWith('references/')
));

if (behaviorFiles.length === 0) {
  console.log('No page-generation behavior files changed; no version increment is required.');
  process.exit(0);
}

function readVersionFromBase(path) {
  const raw = execFileSync('git', ['show', `${base}:${path}`], { encoding: 'utf8' });
  return JSON.parse(raw).version;
}

function parseVersion(version, label) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(String(version));
  if (!match) throw new Error(`${label} version must use MAJOR.MINOR.PATCH; received ${version}`);
  return match.slice(1).map(Number);
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

try {
  const baseVersion = parseVersion(readVersionFromBase('.claude-plugin/plugin.json'), 'Base plugin');
  const baseOpenDesignVersion = parseVersion(readVersionFromBase('open-design.json'), 'Base Open Design');
  const pluginVersion = parseVersion(JSON.parse(readFileSync('.claude-plugin/plugin.json', 'utf8')).version, 'PR plugin');
  const openDesignVersion = parseVersion(JSON.parse(readFileSync('open-design.json', 'utf8')).version, 'PR Open Design');

  if (compareVersions(baseVersion, baseOpenDesignVersion) !== 0) {
    throw new Error(`Base plugin and Open Design versions differ (${baseVersion.join('.')} vs ${baseOpenDesignVersion.join('.')}).`);
  }
  if (compareVersions(pluginVersion, openDesignVersion) !== 0) {
    throw new Error(`PR plugin and Open Design versions must match (${pluginVersion.join('.')} vs ${openDesignVersion.join('.')}).`);
  }

  const headVersion = pluginVersion;
  if (compareVersions(headVersion, baseVersion) <= 0) {
    throw new Error(`Behavior files changed (${behaviorFiles.join(', ')}), but plugin version did not advance from ${baseVersion.join('.')} (PR: ${headVersion.join('.')}).`);
  }
  console.log(`Version advanced from ${baseVersion.join('.')} to ${headVersion.join('.')} for ${behaviorFiles.length} behavior file(s).`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
