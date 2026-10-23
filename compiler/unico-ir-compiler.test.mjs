import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const compilerPath = resolve('compiler/unico-ir-compiler.mjs');
const verifiedImageUrl = 'https://images.unsplash.com/photo-1767169768227-79688439fb37?auto=format&fit=crop&w=1200&q=80';
const verifiedAsset = {
  directUrl: verifiedImageUrl,
  sourcePage: 'https://unsplash.com/photos/mahjong-tiles-arranged-on-a-table-yUaqsVKIHYE',
  author: 'Unsplash contributor',
  license: 'Unsplash License',
  commercialUse: true,
  attributionRequired: false,
  verifiedAt: '2026-07-29',
  contentType: 'image/jpeg',
  statusCode: 200,
};
const testDesignResearch = {
  tool: 'ui-ux-pro-max',
  designSystemQuery: 'editorial service mobile landing page',
  uxQuery: 'visual hierarchy accessibility spacing consistency mobile ux',
  styleReferences: ['Editorial Magazine', 'Swiss / International Typographic'],
};
const testTheme = {
  primary: '#2563eb',
  secondary: '#0f766e',
  accent: '#f59e0b',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  muted: '#64748b',
  onPrimary: '#ffffff',
  onSurface: '#0f172a',
  border: '#cbd5e1',
};

function runCompiler(ir, canonicalContent) {
  const directory = mkdtempSync(join(tmpdir(), 'unico-ir-test-'));
  const inputPath = join(directory, 'unico-design-ir.json');
  const outputPath = join(directory, 'unico-export-result.json');
  const canonicalPath = join(directory, 'unico-page.json');
  writeFileSync(inputPath, `${JSON.stringify(ir, null, 2)}\n`);
  if (canonicalContent !== undefined) writeFileSync(canonicalPath, canonicalContent);
  const execution = spawnSync(process.execPath, [compilerPath, inputPath, outputPath, canonicalPath], { encoding: 'utf8' });
  const result = JSON.parse(readFileSync(outputPath, 'utf8'));
  return { directory, execution, result, canonicalPath };
}

function cleanup(directory) {
  rmSync(directory, { recursive: true, force: true });
}

test('compiles valid IR, estimates text height, and removes empty navbar carriers', () => {
  const run = runCompiler({
    mode: 'replace',
    assetManifest: [verifiedAsset],
    message: 'controlled-variation-v4 test',
    canvasWidth: 386,
    explicitComponents: ['brand-navbar'],
    sections: [
      {
        id: 'navbar-carrier',
        children: [{ type: 'brand-navbar', id: 'main-nav', brandName: 'Studio', showLogo: false }],
      },
      {
        id: 'hero',
        height: 580,
        bgColor: '#111111',
        children: [
          { type: 'text', id: 'hero-title', text: 'A deliberate mobile page', x: 20, y: 24, w: 346, fontSize: 36, lineHeight: 1.1, color: '#ffffff' },
          { type: 'text', id: 'hero-body', text: 'Longer supporting copy wraps safely and receives a conservative automatic height.', x: 20, y: 140, w: 346, fontSize: 16, color: '#ffffff' },
          { type: 'img', id: 'hero-image', src: verifiedImageUrl, x: 20, y: 250, w: 346, h: 260, fit: 'cover', cropArea: { x: 0, y: 0, width: 100, height: 100 } },
        ],
      },
    ],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.equal(run.result.validation.passed, true);
    assert.deepEqual(run.result.assetManifest, [verifiedAsset]);
    assert.equal(run.result.designJson.length, 2);
    assert.equal(run.result.designJson[0].type, 'brand-navbar');
    assert.equal(run.result.designJson[1].type, 'free-box');
    const children = run.result.designJson[1].field.structure.child.component_list.value;
    assert.equal('height' in children[1].field.styles.child, false);
    assert.equal(children[1].field.styles.child.paddingBlock.value, 10);
    assert.equal(children[2].field.structure.label, 'Image Content');
    assert.equal(children[2].field.structure.child.upload.label, 'Image Upload');
    assert.equal(children[2].field.structure.child.upload.value.crop.transform.scale, 1.2);
    assert.equal(children[2].field.styles.child.scale.value, 100);
    assert.equal(children[2].field.styles.child.radius.value, 0);
    assert.ok(existsSync(run.canonicalPath));
  } finally {
    cleanup(run.directory);
  }
});

test('compiles horizontal-scroll sections and permits children beyond the viewport width', () => {
  const assets = [0, 1, 2].map((index) => ({
    ...verifiedAsset,
    directUrl: `${verifiedImageUrl}&rail=${index + 1}`,
  }));
  const run = runCompiler({
    mode: 'replace',
    assetManifest: assets,
    sections: [{
      id: 'poster-rail',
      height: 240,
      enableHorizontalScroll: true,
      children: assets.map((asset, index) => ({
        type: 'img', id: `poster-${index + 1}`, src: asset.directUrl,
        x: 20 + (index * 263), y: 20, w: 243, h: 180, fit: 'contain',
      })),
    }, ...['story', 'details', 'visit', 'contact'].map((id) => ({
      id,
      height: 120,
      children: [{ type: 'text', id: `${id}-title`, text: `${id} section`, x: 20, y: 20, w: 346 }],
    }))],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.equal(run.result.validation.passed, true);
    assert.equal(run.result.designJson[0].field.config.child.enableHorizontalScroll.value, true);
  } finally {
    cleanup(run.directory);
  }
});

test('rejects non-boolean horizontal-scroll settings', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'invalid-scroll-setting',
      enableHorizontalScroll: 'true',
      height: 120,
      children: [{ type: 'text', id: 'scroll-label', text: 'Rail', x: 20, y: 20, w: 200 }],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /enableHorizontalScroll must be a boolean/);
  } finally {
    cleanup(run.directory);
  }
});
test('rejects overlapping text without writing the canonical page', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'bad-text',
      height: 240,
      children: [
        { type: 'text', id: 'title', text: 'Overlapping title', x: 20, y: 20, w: 346, fontSize: 32 },
        { type: 'text', id: 'body', text: 'This starts too early.', x: 20, y: 35, w: 346, fontSize: 16 },
      ],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.equal(run.result.validation.passed, false);
    assert.match(run.result.validation.errors.join('\n'), /overlapping text boxes/);
    assert.equal(existsSync(run.canonicalPath), false);
  } finally {
    cleanup(run.directory);
  }
});

test('rejects same-column text gaps below 8px', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'tight-text',
      height: 240,
      children: [
        { type: 'text', id: 'label', text: 'Section label', x: 20, y: 20, w: 346, h: 30, fontSize: 16 },
        { type: 'text', id: 'title', text: 'Section title', x: 20, y: 54, w: 346, h: 30, fontSize: 16 },
      ],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /only 4px/);
  } finally {
    cleanup(run.directory);
  }
});

test('requires explicit image fit and rejects provable distortion or unsafe cropping', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [
      { id: 'missing-fit', height: 240, children: [{ type: 'img', id: 'image-a', src: verifiedImageUrl, x: 20, y: 20, w: 346, h: 180 }] },
      { id: 'distorted-fill', height: 240, children: [{ type: 'img', id: 'image-b', src: verifiedImageUrl, x: 20, y: 20, w: 346, h: 100, fit: 'fill', sourceWidth: 400, sourceHeight: 800 }] },
      { id: 'unsafe-cover', height: 240, children: [{ type: 'img', id: 'image-c', src: verifiedImageUrl, x: 20, y: 20, w: 346, h: 120, fit: 'cover', sourceWidth: 800, sourceHeight: 1200 }] },
    ],
  });
  try {
    assert.equal(run.execution.status, 1);
    const errors = run.result.validation.errors.join('\n');
    assert.match(errors, /fit is required/);
    assert.match(errors, /would distort the source/);
    assert.match(errors, /set cropArea/);
  } finally {
    cleanup(run.directory);
  }
});

test('computes image zoom from source and frame ratios and defaults unknown ratios to 1.20', () => {
  const makeIr = (image) => ({
    mode: 'replace',
    assetManifest: [verifiedAsset],
    sections: [{ id: 'image-scale', height: 280, children: [image] }],
  });
  const known = runCompiler(makeIr({
    type: 'img', id: 'known-ratio', src: verifiedImageUrl, x: 20, y: 20, w: 240, h: 240,
    fit: 'cover', sourceWidth: 1200, sourceHeight: 900,
  }));
  const tooSmall = runCompiler(makeIr({
    type: 'img', id: 'too-small', src: verifiedImageUrl, x: 20, y: 20, w: 240, h: 240,
    fit: 'cover', scale: 1.33, sourceWidth: 1200, sourceHeight: 900,
  }));
  const unknown = runCompiler(makeIr({
    type: 'img', id: 'unknown-ratio', src: verifiedImageUrl, x: 20, y: 20, w: 240, h: 240,
    fit: 'cover',
  }));
  const cropScale = (run) => run.result.designJson[0].field.structure.child.component_list.value[0].field.structure.child.upload.value.crop.transform.scale;
  try {
    assert.equal(known.execution.status, 0, known.execution.stderr);
    assert.equal(cropScale(known), 1.34);
    assert.equal(tooSmall.execution.status, 1);
    assert.match(tooSmall.result.validation.errors.join('\n'), /below the required minimum 1\.34/);
    assert.equal(unknown.execution.status, 0, unknown.execution.stderr);
    assert.equal(cropScale(unknown), 1.2);
    assert.match(unknown.result.validation.warnings.join('\n'), /defaulting to 1\.20/);
  } finally {
    cleanup(known.directory);
    cleanup(tooSmall.directory);
    cleanup(unknown.directory);
  }
});

test('emits the complete structured image crop and editor transform contract', () => {
  const run = runCompiler({
    mode: 'replace',
    assetManifest: [verifiedAsset],
    sections: [{
      id: 'structured-image',
      height: 300,
      children: [{
        type: 'img',
        id: 'structured-image-child',
        src: verifiedImageUrl,
        x: 237,
        y: 156,
        w: 121,
        h: 118,
        fit: 'contain',
        scale: 1.3,
        rotate: 30,
        cropArea: { x: 30, y: 0, width: 100, height: 100 },
        radius: 30,
        customCSS: 'box-shadow: 0 3px 4px gray;',
        sourceWidth: 200,
        sourceHeight: 200,
      }],
    }],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    const image = run.result.designJson[0].field.structure.child.component_list.value[0];
    assert.equal(image.label, 'Image');
    assert.equal(image.type, 'img');
    assert.equal(image.field.structure.label, 'Image Content');
    assert.deepEqual(image.field.structure.child.upload.value, {
      url: verifiedImageUrl,
      crop: {
        mode: 'manual',
        fitMode: 'contain',
        cropArea: { x: 30, y: 0, width: 100, height: 100 },
        transform: { scale: 1.3, rotate: 30 },
        originalWidth: 200,
        originalHeight: 200,
      },
    });
    const styles = image.field.styles.child;
    assert.equal(styles.scale.value, 100);
    assert.equal(styles.rotate.value, 0);
    assert.equal(styles.translateX.value, 0);
    assert.equal(styles.translateY.value, 0);
    assert.equal(styles.radius.value, 30);
    assert.equal(styles.customCSS.value, 'box-shadow: 0 3px 4px gray;');
    assert.equal(styles.top.value, 156);
    assert.equal(styles.left.value, 237);
  } finally {
    cleanup(run.directory);
  }
});

test('rejects high-layer backgrounds over text and separate text over buttons', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'bad-layering',
      height: 320,
      children: [
        { type: 'rectangle', id: 'panel', x: 20, y: 20, w: 346, h: 120, zIndex: 8, bgColor: '#000000' },
        { type: 'text', id: 'panel-title', text: 'Hidden title', x: 40, y: 50, w: 300, zIndex: 5, color: '#ffffff' },
        { type: 'button', id: 'cta', text: 'Book now', x: 20, y: 180, w: 346, h: 48, zIndex: 3 },
        { type: 'text', id: 'fake-button-label', text: 'Book now', x: 80, y: 188, w: 200, zIndex: 4 },
      ],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    const errors = run.result.validation.errors.join('\n');
    assert.match(errors, /covering/);
    assert.match(errors, /button's own text field/);
  } finally {
    cleanup(run.directory);
  }
});

test('rejects mixing top-level business components with free-positioned content', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'mixed-events',
      children: [
        { type: 'text', text: 'Upcoming events', x: 20, y: 20, w: 346 },
        { type: 'event-list', styleMode: 0 },
      ],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /only non-navbar child/);
  } finally {
    cleanup(run.directory);
  }
});

test('rejects out-of-bounds components and duplicate IDs', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'bounds',
      height: 300,
      children: [
        { type: 'img', id: 'duplicate', src: verifiedImageUrl, x: -20, y: 0, w: 420, h: 200 },
        { type: 'button', id: 'duplicate', text: 'Action', x: 20, y: 220, w: 346, h: 48 },
      ],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    const errors = run.result.validation.errors.join('\n');
    assert.match(errors, /horizontal section bounds/);
    assert.match(errors, /duplicate id/);
  } finally {
    cleanup(run.directory);
  }
});

test('stops on malformed canonical pages and preserves the original file', () => {
  const original = '{ invalid canonical json';
  const run = runCompiler({
    mode: 'extend',
    sections: [{ id: 'new', height: 240, children: [{ type: 'text', text: 'New section', x: 20, y: 20, w: 346 }] }],
  }, original);
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /Cannot safely read existing canonical page/);
    assert.equal(readFileSync(run.canonicalPath, 'utf8'), original);
  } finally {
    cleanup(run.directory);
  }
});

test('extend preserves complete canonical components and appends only new free boxes', () => {
  const seed = runCompiler({
    mode: 'replace',
    sections: [
      { id: 'legacy-events', children: [{ type: 'event-list', id: 'legacy-event-list' }] },
      {
        id: 'legacy-section',
        height: 180,
        children: [{ type: 'text', id: 'legacy-text', text: 'Existing content', x: 20, y: 40, w: 346 }],
      },
      {
        id: 'legacy-rich-carrier',
        height: 180,
        children: [{ type: 'rich-text', id: 'legacy-rich', html: '<p>Existing formatted content</p>', x: 20, y: 40, w: 346 }],
      },
    ],
  });
  assert.equal(seed.execution.status, 0, seed.execution.stderr);
  const legacyRich = seed.result.designJson[2].field.structure.child.component_list.value[0];
  const legacyDesign = [legacyRich, ...seed.result.designJson.slice(0, 2)];
  const canonical = `${JSON.stringify({ designJson: legacyDesign, message: 'legacy' }, null, 2)}\n`;
  const run = runCompiler({
    mode: 'extend',
    sections: [{ id: 'addition', height: 240, children: [{ type: 'text', id: 'addition-text', text: 'New content', x: 20, y: 20, w: 346 }] }],
  }, canonical);
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.deepEqual(run.result.designJson.slice(0, 3), legacyDesign);
    assert.equal(run.result.designJson[3].type, 'free-box');
  } finally {
    cleanup(seed.directory);
    cleanup(run.directory);
  }
});

test('final output validation rejects incomplete component contracts from canonical JSON', () => {
  const incompleteCanonical = {
    designJson: [
      {
        id: 'legacy-section',
        label: 'Legacy Section',
        type: 'free-box',
        field: {
          structure: {
            label: 'Freeform Container',
            child: {
              component_list: {
                label: 'Widgets List',
                type: 'component_list',
                value: [{
                  id: 'broken-text',
                  label: 'Text',
                  type: 'text',
                  field: {
                    structure: { label: 'Text Content', child: {} },
                    styles: { label: 'Text Style', child: {} },
                  },
                }],
              },
            },
          },
          styles: { label: 'Container Style', child: {} },
        },
      },
      {
        id: 'broken-events',
        label: 'Event List',
        type: 'event-list',
        component: {
          name: 'event-list',
          props: { data: { events: [] } },
        },
      },
    ],
  };
  const run = runCompiler({
    mode: 'extend',
    sections: [{
      id: 'addition',
      height: 160,
      children: [{ type: 'text', id: 'addition-text', text: 'New content', x: 20, y: 40, w: 346 }],
    }],
  }, `${JSON.stringify(incompleteCanonical, null, 2)}\n`);
  try {
    assert.equal(run.execution.status, 1);
    assert.equal(run.result.validation.passed, false);
    assert.match(run.result.validation.errors.join('\n'), /missing required field/);
    assert.match(run.result.validation.errors.join('\n'), /data\.styleMode/);
    assert.deepEqual(JSON.parse(readFileSync(run.canonicalPath, 'utf8')), incompleteCanonical);
  } finally {
    cleanup(run.directory);
  }
});

test('enforces deprecated, explicit-only, and single-use component policies', () => {
  const deprecated = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'deprecated-shape',
      height: 160,
      children: [{ type: 'circle', id: 'circle', x: 20, y: 20, w: 80, h: 80 }],
    }],
  });
  const undeclared = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'undeclared-rating',
      height: 160,
      children: [{ type: 'rating', id: 'rating', rating: '4.8', reviewCount: '128', x: 20, y: 20, w: 250, h: 60 }],
    }],
  });
  const repeated = runCompiler({
    mode: 'replace',
    sections: [
      { id: 'events-one', children: [{ type: 'event-list', id: 'events-1' }] },
      { id: 'events-two', children: [{ type: 'event-list', id: 'events-2' }] },
    ],
  });
  const declared = runCompiler({
    mode: 'replace',
    explicitComponents: ['rating'],
    sections: [{
      id: 'declared-rating',
      height: 160,
      children: [{ type: 'rating', id: 'rating', rating: '4.8', reviewCount: '128', x: 20, y: 20, w: 250, h: 60 }],
    }],
  });
  try {
    assert.equal(deprecated.execution.status, 1);
    assert.match(deprecated.result.validation.errors.join('\n'), /deprecated/);
    assert.equal(undeclared.execution.status, 1);
    assert.match(undeclared.result.validation.errors.join('\n'), /explicitly requested/);
    assert.equal(repeated.execution.status, 1);
    assert.match(repeated.result.validation.errors.join('\n'), /at most once/);
    assert.equal(declared.execution.status, 0, declared.execution.stderr);
  } finally {
    cleanup(deprecated.directory);
    cleanup(undeclared.directory);
    cleanup(repeated.directory);
    cleanup(declared.directory);
  }
});

test('completes nested fixed-component link fields before the final audit', () => {
  const run = runCompiler({
    mode: 'replace',
    assetManifest: [verifiedAsset],
    explicitComponents: ['navigation'],
    sections: [
      {
        id: 'navigation-carrier',
        children: [{
          type: 'navigation',
          id: 'navigation',
          items: [{ text: 'Home', link: { page: 'home' } }],
        }],
      },
      {
        id: 'banner-carrier',
        children: [{
          type: 'banner',
          id: 'banner',
          items: [{ src: verifiedImageUrl, link: { page: 'events' } }],
        }],
      },
    ],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.deepEqual(run.result.designJson[0].component.props.list[0].link, {
      page: 'home',
      appid: '',
      type: '',
      name: '',
    });
    assert.deepEqual(run.result.designJson[1].component.props.list[0].link, {
      name: '',
      type: '',
      appid: '',
      page: 'events',
    });
  } finally {
    cleanup(run.directory);
  }
});

test('records and validates the UI/UX controlled-variation design profile', () => {
  const section = {
    id: 'profile-section',
    height: 160,
    children: [{ type: 'text', id: 'profile-text', text: 'Distinctive content', x: 20, y: 40, w: 346 }],
  };
  const missing = runCompiler({ mode: 'replace', sections: [section] });
  const malformed = runCompiler({
    mode: 'replace',
    designProfile: { source: 'ui-ux-pro-max' },
    sections: [section],
  });
  const valid = runCompiler({
    mode: 'replace',
    designProfile: {
      source: 'ui-ux-pro-max-fallback',
      query: 'editorial service mobile landing page',
      direction: 'Editorial service guide',
      variationSeed: 'service-ledger-12',
      designResearch: testDesignResearch,
      theme: testTheme,
      axes: {
        layout: 'asymmetric editorial stack',
        palette: 'warm paper and ink',
        typography: 'display serif and compact sans',
        imageRhythm: 'alternating landscape and portrait crops',
      },
    },
    sections: [section],
  });
  try {
    assert.equal(missing.execution.status, 0, missing.execution.stderr);
    assert.match(missing.result.validation.warnings.join('\n'), /No designProfile/);
    assert.equal(malformed.execution.status, 1);
    assert.match(malformed.result.validation.errors.join('\n'), /designProfile.*missing required field/);
    assert.equal(valid.execution.status, 0, valid.execution.stderr);
    assert.doesNotMatch(valid.result.validation.warnings.join('\n'), /No designProfile/);
  } finally {
    cleanup(missing.directory);
    cleanup(malformed.directory);
    cleanup(valid.directory);
  }
});

test('requires professional design research and rejects colors outside the page theme', () => {
  const run = runCompiler({
    mode: 'replace',
    designProfile: {
      source: 'ui-ux-pro-max',
      query: 'service mobile landing page',
      direction: 'Consistent service page',
      variationSeed: 'service-theme-11',
      designResearch: testDesignResearch,
      theme: testTheme,
      axes: {
        layout: 'asymmetric editorial',
        palette: 'semantic blue teal amber',
        typography: 'display serif and compact sans',
        imageRhythm: 'single hero and supporting crops',
      },
    },
    sections: [{
      id: 'theme-section',
      height: 180,
      bgColor: '#ff00ff',
      children: [{ type: 'text', id: 'theme-text', text: 'Theme consistency', x: 20, y: 40, w: 346, color: '#0f172a' }],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /outside designProfile\.theme/);
  } finally {
    cleanup(run.directory);
  }
});

test('keeps legacy design profiles compilable without the optional research and theme fields', () => {
  const run = runCompiler({
    mode: 'replace',
    designProfile: {
      source: 'legacy-design-tool',
      query: 'legacy mobile page',
      direction: 'Legacy direction',
      variationSeed: 'legacy-01',
      axes: {
        layout: 'stacked',
        palette: 'neutral',
        typography: 'sans',
        imageRhythm: 'single hero',
      },
    },
    sections: [{
      id: 'legacy-section',
      height: 160,
      children: [{ type: 'text', id: 'legacy-text', text: 'Legacy content', x: 20, y: 40, w: 346 }],
    }],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.match(run.result.validation.warnings.join('\n'), /legacy profiles remain compatible/);
  } finally {
    cleanup(run.directory);
  }
});

test('all active components compile to valid JSON and report composition metrics', () => {
  const visual = [
    ['text', { text: 'Specific content' }],
    ['img', { src: verifiedImageUrl, fit: 'contain', sourceWidth: 1200, sourceHeight: 800 }],
    ['button', { text: 'Book a session' }],
    ['rectangle', {}],
    ['rich-text', { html: '<p>Formatted content</p>' }],
    ['video-player', { url: 'assets/video.mp4' }],
    ['countdown', { title: 'Registration closes', targetDate: '2026-08-01' }],
    ['tabs', { tabs: [{ title: 'One', height: 180, children: [{ type: 'text', text: 'Tab content', x: 10, y: 10, w: 280 }] }] }],
    ['accordion', { items: [{ title: 'Question', content: 'Answer' }] }],
    ['map', { address: 'Venue address', embedUrl: 'https://maps.google.com/embed' }],
    ['rating', { rating: '4.8', reviewCount: '128' }],
    ['social-share', { title: 'Share' }],
    ['person-profile', { name: 'Person name' }],
    ['inquiry-box', { title: 'Contact' }],
  ];
  const fixed = ['goods-list', 'coupon', 'search', 'discount-promotion', 'event-list', 'event-calendar', 'blog-list'];
  const sections = visual.map(([type, fields]) => ({
    id: `visual-${type}`,
    height: 520,
    children: [{ type, id: `child-${type}`, x: 20, y: 20, w: 346, ...fields }],
  }));
  sections.unshift({ id: 'navbar', children: [{ type: 'brand-navbar', id: 'nav', brandName: 'Brand', showLogo: false }] });
  sections.push({ id: 'fixed-banner', children: [{ type: 'banner', id: 'banner', items: [{ src: verifiedImageUrl }] }] });
  sections.push({ id: 'fixed-navigation', children: [{ type: 'navigation', id: 'navigation', items: [{ text: 'Home' }] }] });
  sections.push({ id: 'fixed-store', children: [{ type: 'store-information', id: 'store', storeName: 'Store' }] });
  sections.push({ id: 'fixed-service', children: [{ type: 'service-list', id: 'service', storeName: 'Service Provider' }] });
  for (const type of fixed) sections.push({ id: `fixed-${type}`, children: [{ type, id: `child-${type}` }] });

  const run = runCompiler({
    mode: 'replace',
    assetManifest: [verifiedAsset],
    canvasWidth: 386,
    explicitComponents: [
      'video-player', 'countdown', 'tabs', 'accordion', 'rating', 'social-share',
      'person-profile', 'coupon', 'navigation', 'brand-navbar', 'search',
      'discount-promotion',
    ],
    sections,
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.equal(run.result.validation.passed, true);
    assert.equal(run.result.validation.metrics.componentCounts.text, 2);
    assert.equal(run.result.validation.metrics.imageCount, 1);
    assert.equal(run.result.validation.metrics.richTextCount, 1);
    assert.ok(run.result.validation.metrics.corePrimitiveRatio > 0);
    assert.equal(run.result.designJson.length, 26);
  } finally {
    cleanup(run.directory);
  }
});

test('reports a quantified warning when rich text usage is excessive', () => {
  const sections = [
    { id: 'plain', height: 240, children: [{ type: 'text', id: 'plain-text', text: 'Plain text', x: 20, y: 20, w: 346 }] },
    ...[1, 2, 3].map((index) => ({
      id: `rich-${index}`,
      height: 240,
      children: [{ type: 'rich-text', id: `rich-text-${index}`, html: `<p>Formatted ${index}</p>`, x: 20, y: 20, w: 346 }],
    })),
  ];
  const run = runCompiler({ mode: 'replace', sections });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.equal(run.result.validation.metrics.richTextCount, 3);
    assert.equal(run.result.validation.metrics.richTextRatio, 0.75);
    assert.match(run.result.validation.warnings.join('\n'), /Rich text represents 75%/);
  } finally {
    cleanup(run.directory);
  }
});

test('text components match the exact Unico contract without a height field', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'text-contract',
      height: 320,
      children: [{
        type: 'text',
        id: 'hero-title',
        label: 'Hero title',
        text: "Hey Pong Yo, Let's Mahjong!",
        x: 8,
        y: 103,
        w: 367,
        fontSize: 48,
        fontFamily: 'Bungee, sans-serif',
        color: 'rgb(255, 255, 255)',
        fontWeight: '700',
        letterSpacing: -0.48,
        lineHeight: 1.05,
        justify: 'center',
        zIndex: 4,
      }],
    }],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    const component = run.result.designJson[0].field.structure.child.component_list.value[0];
    assert.deepEqual(component, {
      id: 'hero-title',
      label: 'Text',
      type: 'text',
      field: {
        structure: {
          label: 'Text Content',
          child: {
            text: { label: 'Text', type: 'text', value: "Hey Pong Yo, Let's Mahjong!" },
            link: {
              label: 'Link Settings',
              type: 'link',
              value: { page: '', url: '', type: 'external', serviceId: '', productId: '' },
            },
          },
        },
        styles: {
          label: 'Text Style',
          child: {
            width: { label: 'Width', type: 'width', value: 367 },
            paddingInline: { label: 'Horizontal Padding', type: 'paddingInline', value: 20 },
            paddingBlock: { label: 'Vertical Padding', type: 'paddingBlock', value: 10 },
            fontSize: { label: 'Font Size', type: 'fontSize', value: 48 },
            fontFamily: { label: 'Font Family', type: 'fontFamily', value: 'Bungee, sans-serif' },
            color: { label: 'Font Color', type: 'color', value: 'rgb(255, 255, 255)' },
            fontWeight: { label: 'Font Weight', type: 'fontWeight', value: '700' },
            letterSpacing: { label: 'Letter Spacing', type: 'letterSpacing', value: -0.48 },
            lineHeight: { label: 'Line Height', type: 'lineHeight', value: 1.05 },
            fontStyle: { label: 'Italic', type: 'fontStyle', value: 'normal' },
            textDecoration: { label: 'Underline', type: 'textDecoration', value: 'none' },
            justify: { label: 'Layout', type: 'justify', value: 'center' },
            zIndex: { label: 'Levels', type: 'zIndex', value: 4 },
            top: { label: 'Top Distance', type: 'top', value: 103 },
            left: { label: 'Left Distance', type: 'left', value: 8 },
          },
        },
      },
    });
  } finally {
    cleanup(run.directory);
  }
});

test('estimates rich-text height from content width, padding, and font size', () => {
  const samples = [
    { id: 'narrow', text: 'Easy walks and easy talks for weekends.', width: 88, fontSize: 12, expectedHeight: 140 },
    { id: 'wide', text: 'Every new guest gets a welcome, an introduction, and helpful guidance.', width: 346, fontSize: 14, expectedHeight: 90 },
    { id: 'medium', text: 'Walk by the sea and meet new friends.', width: 190, fontSize: 12, expectedHeight: 77 },
  ];
  const run = runCompiler({
    mode: 'replace',
    sections: samples.map((sample) => ({
      id: `rich-${sample.id}`,
      height: 180,
      children: [{
        type: 'rich-text',
        id: sample.id,
        text: sample.text,
        x: 20,
        y: 20,
        w: sample.width,
        fontSize: sample.fontSize,
        paddingInline: 10,
        paddingBlock: 10,
      }],
    })),
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    const heights = run.result.designJson.map((section) => {
      const component = section.field.structure.child.component_list.value[0];
      assert.equal(component.field.styles.child.paddingInline.value, 10);
      assert.equal(component.field.styles.child.paddingBlock.value, 10);
      return component.field.styles.child.height.value;
    });
    assert.deepEqual(heights, samples.map(({ expectedHeight }) => expectedHeight));
  } finally {
    cleanup(run.directory);
  }
});

test('rejects image-provider detail pages and accepts verified CDN image URLs', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [
      {
        id: 'bad-image-page',
        height: 240,
        children: [{
          type: 'img',
          id: 'page-url',
          src: 'https://unsplash.com/photos/mahjong-tiles-arranged-on-a-table-yUaqsVKIHYE',
          x: 20,
          y: 20,
          w: 346,
          h: 180,
          fit: 'cover',
        }],
      },
      {
        id: 'good-image-cdn',
        height: 240,
        children: [{
          type: 'img',
          id: 'direct-url',
          src: 'https://images.unsplash.com/photo-1767169768227-79688439fb37?auto=format&fit=crop&w=1200&q=80',
          x: 20,
          y: 20,
          w: 346,
          h: 180,
          fit: 'cover',
        }],
      },
    ],
  });
  try {
    assert.equal(run.execution.status, 1);
    const errors = run.result.validation.errors.join('\n');
    assert.match(errors, /not a direct image URL/);
    assert.doesNotMatch(errors, /good-image-cdn/);
  } finally {
    cleanup(run.directory);
  }
});

test('requires explicit commercial-use license evidence for every image', () => {
  const makeIr = (assetManifest) => ({
    mode: 'replace',
    assetManifest,
    sections: [{
      id: 'licensed-image',
      height: 240,
      children: [{ type: 'img', id: 'licensed-photo', src: verifiedImageUrl, x: 20, y: 20, w: 346, h: 180, fit: 'cover' }],
    }],
  });
  const missing = runCompiler(makeIr([]));
  const unknown = runCompiler(makeIr([{ ...verifiedAsset, license: 'Unknown' }]));
  const nonCommercial = runCompiler(makeIr([{ ...verifiedAsset, license: 'CC BY-NC 4.0' }]));
  const missingEvidence = runCompiler(makeIr([{ ...verifiedAsset, sourcePage: '', author: '' }]));
  const cc0 = runCompiler(makeIr([{ ...verifiedAsset, sourcePage: 'https://creativecommons.org/publicdomain/zero/1.0/', license: 'CC0' }]));
  const publicDomain = runCompiler(makeIr([{ ...verifiedAsset, license: 'Public Domain' }]));
  const explicitCommercial = runCompiler(makeIr([{ ...verifiedAsset, license: 'Pexels License' }]));
  try {
    assert.equal(missing.execution.status, 1);
    assert.match(missing.result.validation.errors.join('\n'), /no matching assetManifest entry/);
    assert.equal(unknown.execution.status, 1);
    assert.match(unknown.result.validation.errors.join('\n'), /explicitly permit commercial use/);
    assert.equal(nonCommercial.execution.status, 1);
    assert.match(nonCommercial.result.validation.errors.join('\n'), /explicitly permit commercial use/);
    assert.equal(missingEvidence.execution.status, 1);
    assert.match(missingEvidence.result.validation.errors.join('\n'), /sourcePage is required/);
    assert.match(missingEvidence.result.validation.errors.join('\n'), /author is required/);
    assert.equal(cc0.execution.status, 0, cc0.execution.stderr);
    assert.equal(publicDomain.execution.status, 0, publicDomain.execution.stderr);
    assert.equal(explicitCommercial.execution.status, 0, explicitCommercial.execution.stderr);
  } finally {
    [missing, unknown, nonCommercial, missingEvidence, cc0, publicDomain, explicitCommercial].forEach(({ directory }) => cleanup(directory));
  }
});

test('validates optional style-family metadata and materially different design directions', () => {
  const section = {
    id: 'style-profile-section',
    height: 160,
    children: [{ type: 'text', id: 'style-profile-text', text: 'Distinctive content', x: 20, y: 40, w: 346 }],
  };
  const directions = [
    {
      name: 'Editorial direction',
      styleFamily: 'Editorial Magazine',
      axes: { layout: 'asymmetric editorial', palette: 'warm paper', typography: 'display serif', imageRhythm: 'portrait sequence', surfaceTreatment: 'ruled panels', ctaTreatment: 'full-width anchor', sectionTransition: 'image bleed' },
    },
    {
      name: 'Utility direction',
      styleFamily: 'Monochrome Utility',
      axes: { layout: 'modular catalog', palette: 'monochrome accent', typography: 'compact grotesk', imageRhythm: 'sparse hero only', surfaceTreatment: 'hard-edge blocks', ctaTreatment: 'outlined secondary', sectionTransition: 'divider rhythm' },
    },
    {
      name: 'Coastal direction',
      styleFamily: 'Coastal / Mediterranean',
      axes: { layout: 'split narrative', palette: 'coastal cool', typography: 'friendly sans', imageRhythm: 'alternating landscape and square', surfaceTreatment: 'flat color fields', ctaTreatment: 'final-section conversion block', sectionTransition: 'color cut' },
    },
  ];
  const valid = runCompiler({
    mode: 'replace',
    designProfile: {
      source: 'ui-ux-pro-max-fallback',
      query: 'community landing page',
      direction: 'Editorial community page',
      variationSeed: 'community-style-17',
      styleFamily: 'Editorial Magazine',
      designResearch: testDesignResearch,
      theme: testTheme,
      axes: {
        layout: 'asymmetric editorial',
        palette: 'warm paper',
        typography: 'display serif',
        imageRhythm: 'portrait sequence',
        surfaceTreatment: 'ruled panels',
      },
      directions,
    },
    sections: [section],
  });
  const insufficient = runCompiler({
    mode: 'replace',
    designProfile: {
      source: 'ui-ux-pro-max',
      query: 'community landing page',
      direction: 'Repeated card page',
      variationSeed: 'repeated-style-01',
      designResearch: testDesignResearch,
      theme: testTheme,
      axes: { layout: 'centered', palette: 'neutral', typography: 'sans', imageRhythm: 'single hero' },
      directions: directions.map((direction) => ({ ...direction, axes: { ...directions[0].axes } })),
    },
    sections: [section],
  });
  try {
    assert.equal(valid.execution.status, 0, valid.execution.stderr);
    assert.equal(insufficient.execution.status, 1);
    assert.match(insufficient.result.validation.errors.join('\n'), /at least four design axes/);
  } finally {
    cleanup(valid.directory);
    cleanup(insufficient.directory);
  }
});

test('rejects explicit rich-text heights below the estimated content height', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'short-rich-text',
      height: 180,
      children: [{
        type: 'rich-text',
        id: 'rich-copy',
        text: 'Every new guest gets a welcome, an introduction, and helpful guidance.',
        x: 20,
        y: 20,
        w: 346,
        h: 40,
        padding: 10,
        fontSize: 14,
      }],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /rich-text height 40 is too small.*90/);
  } finally {
    cleanup(run.directory);
  }
});

test('button horizontal and vertical padding both default to 0', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'button-padding',
      height: 160,
      children: [{ type: 'button', id: 'cta', text: 'Book now', x: 20, y: 40, w: 346, h: 48 }],
    }],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    const styles = run.result.designJson[0].field.structure.child.component_list.value[0].field.styles.child;
    assert.equal(styles.paddingInline.value, 0);
    assert.equal(styles.paddingBlock.value, 0);
  } finally {
    cleanup(run.directory);
  }
});

test('accepts verified remote SVG images while rejecting inline SVG, SVGZ, data, and local sources', () => {
  const svgAssetUrl = 'https://cdn.example.test/mahjong-red-dragon.svg';
  const rasterAssetUrl = 'https://cdn.example.test/mahjong-wind-tile.png';
  const photoAssetUrl = 'https://cdn.example.test/mahjong-table.jpg';
  const assetManifest = [
    {
      ...verifiedAsset,
      directUrl: svgAssetUrl,
      sourcePage: 'https://www.svgrepo.com/svg/example/mahjong-red-dragon',
      author: 'Icon author',
      license: 'CC BY 4.0',
      contentType: 'image/svg+xml',
    },
    {
      ...verifiedAsset,
      directUrl: rasterAssetUrl,
      sourcePage: 'https://icons8.com/icon/example/mahjong-wind-tile',
      contentType: 'image/png',
    },
    {
      ...verifiedAsset,
      directUrl: photoAssetUrl,
      sourcePage: 'https://unsplash.com/photos/example-mahjong-table',
    },
  ];
  const accepted = runCompiler({
    mode: 'replace',
    assetManifest,
    sections: [
      { id: 'hero', height: 240, children: [{ type: 'text', id: 'hero-title', text: 'Mahjong club', x: 20, y: 16, w: 346, fontSize: 24 }, { type: 'img', id: 'hero-stamp', src: svgAssetUrl, x: 20, y: 86, w: 96, h: 96, fit: 'contain' }] },
      { id: 'story', height: 240, children: [{ type: 'text', id: 'story-title', text: 'A place to play', x: 20, y: 16, w: 346, fontSize: 24 }, { type: 'img', id: 'story-tile', src: rasterAssetUrl, x: 20, y: 86, w: 96, h: 96, fit: 'contain' }] },
      { id: 'events', height: 240, children: [{ type: 'text', id: 'events-title', text: 'Gather around', x: 20, y: 16, w: 346, fontSize: 24 }, { type: 'img', id: 'events-photo', src: photoAssetUrl, x: 20, y: 86, w: 180, h: 120, fit: 'cover' }] },
      { id: 'details', height: 120, children: [{ type: 'text', id: 'details-title', text: 'How to join', x: 20, y: 16, w: 346, fontSize: 24 }] },
      { id: 'contact', height: 120, children: [{ type: 'text', id: 'contact-title', text: 'Visit the club', x: 20, y: 16, w: 346, fontSize: 24 }] },
    ],
  });
  const invalidSources = [
    'assets/generated.svg',
    'https://cdn.example.test/generated.svgz',
    'https://images.example.test/render?format=svg',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    'assets/local-photo.jpg',
  ];
  const rejected = runCompiler({
    mode: 'replace',
    sections: invalidSources.map((src, index) => ({
      id: `invalid-image-${index}`,
      height: 160,
      children: [{ type: 'img', id: `image-${index}`, src, x: 20, y: 20, w: 120, h: 100, fit: 'cover' }],
    })),
  });
  const mismatchedMime = runCompiler({
    mode: 'replace',
    assetManifest: [{ ...verifiedAsset, directUrl: svgAssetUrl, contentType: 'image/png' }],
    sections: [{ id: 'svg-mime', height: 160, children: [{ type: 'img', id: 'svg-mime-image', src: svgAssetUrl, x: 20, y: 20, w: 120, h: 100, fit: 'contain' }] }],
  });
  try {
    assert.equal(accepted.execution.status, 0, accepted.execution.stderr);
    assert.equal(accepted.result.validation.passed, true);
    assert.equal(accepted.result.assetManifest[0].contentType, 'image/svg+xml');
    const errors = rejected.result.validation.errors.join('\n');
    assert.equal(rejected.execution.status, 1);
    assert.match(errors, /inline and data-URL SVG images are forbidden/);
    assert.match(errors, /compressed SVGZ images are unsupported/);
    assert.match(errors, /must use a verified HTTP\(S\) image URL/);
    assert.equal(mismatchedMime.execution.status, 1);
    assert.match(mismatchedMime.result.validation.errors.join('\n'), /contentType must be image\/svg\+xml when directUrl requests an SVG image/);
  } finally {
    [accepted, rejected, mismatchedMime].forEach(({ directory }) => cleanup(directory));
  }
});

test('accepts SVG query URLs only when the observed manifest media type is SVG', () => {
  const svgUrl = 'https://images.example.test/render?id=123&format=svg';
  const rasterUrl = 'https://cdn.example.test/supporting-art.png';
  const photoUrl = 'https://cdn.example.test/subject-photo.jpg';
  const run = runCompiler({
    mode: 'replace',
    assetManifest: [
      { ...verifiedAsset, directUrl: svgUrl, contentType: 'image/svg+xml' },
      { ...verifiedAsset, directUrl: rasterUrl, sourcePage: 'https://icons8.com/icon/example/supporting-art', contentType: 'image/png' },
      { ...verifiedAsset, directUrl: photoUrl, sourcePage: 'https://unsplash.com/photos/example-subject-photo', contentType: 'image/jpeg' },
    ],
    sections: [
      { id: 'hero', height: 200, children: [{ type: 'text', id: 'hero-title', text: 'Poster', x: 20, y: 16, w: 346, fontSize: 24 }, { type: 'img', id: 'poster-art', src: svgUrl, x: 20, y: 80, w: 120, h: 100, fit: 'contain' }] },
      { id: 'story', height: 200, children: [{ type: 'text', id: 'story-title', text: 'Story', x: 20, y: 16, w: 346, fontSize: 24 }, { type: 'img', id: 'story-art', src: rasterUrl, x: 20, y: 80, w: 120, h: 100, fit: 'contain' }] },
      { id: 'events', height: 200, children: [{ type: 'text', id: 'events-title', text: 'Events', x: 20, y: 16, w: 346, fontSize: 24 }, { type: 'img', id: 'event-photo', src: photoUrl, x: 20, y: 80, w: 120, h: 100, fit: 'cover' }] },
      { id: 'details', height: 100, children: [{ type: 'text', id: 'details-title', text: 'Details', x: 20, y: 16, w: 346, fontSize: 24 }] },
      { id: 'contact', height: 100, children: [{ type: 'text', id: 'contact-title', text: 'Contact', x: 20, y: 16, w: 346, fontSize: 24 }] },
    ],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.equal(run.result.validation.passed, true);
  } finally {
    cleanup(run.directory);
  }
});

test('rejects SVG manifest entries whose media type is not an image type', () => {
  const svgUrl = 'https://cdn.example.test/mahjong-red-dragon.svg';
  const run = runCompiler({
    mode: 'replace',
    assetManifest: [{ ...verifiedAsset, directUrl: svgUrl, contentType: 'text/html' }],
    sections: [{ id: 'svg-mime', height: 160, children: [{ type: 'img', id: 'svg-mime-image', src: svgUrl, x: 20, y: 20, w: 120, h: 100, fit: 'contain' }] }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /contentType must be a verified image\/\* media type/);
  } finally {
    cleanup(run.directory);
  }
});

test('rectangle cards without height include the estimated height of contained text', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'auto-card',
      children: [
        { type: 'rectangle', id: 'card', x: 20, y: 20, w: 346, zIndex: 1, bgColor: '#ffffff', radius: 16 },
        {
          type: 'text',
          id: 'card-copy',
          text: 'This card description wraps across several lines and extends beyond the rectangle default height.',
          x: 40,
          y: 44,
          w: 306,
          fontSize: 16,
          lineHeight: 1.5,
          zIndex: 2,
        },
      ],
    }],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    const section = run.result.designJson[0];
    const children = section.field.structure.child.component_list.value;
    const cardHeight = children[0].field.styles.child.height.value;
    const sectionHeight = section.field.styles.child.height.value;
    assert.ok(cardHeight > 80);
    assert.ok(sectionHeight >= 20 + cardHeight + 32);
  } finally {
    cleanup(run.directory);
  }
});

test('rejects explicit rectangle card heights that cannot contain their text', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'short-card',
      height: 240,
      children: [
        { type: 'rectangle', id: 'card', x: 20, y: 20, w: 346, h: 80, zIndex: 1, bgColor: '#ffffff' },
        {
          type: 'text',
          id: 'card-copy',
          text: 'This card description wraps across several lines and extends beyond the rectangle default height.',
          x: 40,
          y: 44,
          w: 306,
          fontSize: 16,
          lineHeight: 1.5,
          zIndex: 2,
        },
      ],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /card height 80 is too small/);
  } finally {
    cleanup(run.directory);
  }
});

test('business components occupy carrier sections but compile beside free boxes', () => {
  const run = runCompiler({
    mode: 'replace',
    explicitComponents: ['coupon'],
    sections: [
      { id: 'intro', height: 160, children: [{ type: 'text', id: 'intro-text', text: 'Event introduction', x: 20, y: 40, w: 346 }] },
      { id: 'event-carrier', children: [{ type: 'event-list', id: 'event', styleMode: 0 }] },
      { id: 'service-carrier', children: [{ type: 'service-list', id: 'service', storeName: 'Service Provider' }] },
      { id: 'product-carrier', children: [{ type: 'product-list', id: 'products' }] },
      { id: 'blog-carrier', children: [{ type: 'blog', id: 'blog' }] },
      { id: 'coupon-carrier', children: [{ type: 'coupon', id: 'coupon' }] },
      { id: 'inquiry-carrier', children: [{ type: 'inquiry', id: 'inquiry', title: 'Contact us' }] },
      { id: 'map-carrier', children: [{ type: 'map', id: 'map', address: 'Venue', embedUrl: 'https://www.google.com/maps/embed' }] },
      { id: 'store-carrier', children: [{ type: 'storeinfo', id: 'store', storeName: 'Store' }] },
      { id: 'outro', height: 160, children: [{ type: 'text', id: 'outro-text', text: 'Contact us', x: 20, y: 40, w: 346 }] },
    ],
  });
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    assert.deepEqual(run.result.designJson.map(({ type }) => type), [
      'free-box', 'event-list', 'service-list', 'goods-list', 'blog-list',
      'coupon', 'inquiry-box', 'map', 'store-information', 'free-box',
    ]);
    const inquiry = run.result.designJson.find(({ type }) => type === 'inquiry-box');
    assert.equal('width' in inquiry.field.styles.child, false);
    assert.deepEqual(run.result.designJson[1], {
      id: 'event',
      label: 'Event List',
      type: 'event-list',
      component: {
        name: 'event-list',
        props: { data: { events: [], styleMode: 0 } },
      },
    });
    for (const component of run.result.designJson.slice(1, 9)) {
      assert.notEqual(component.type, 'free-box');
    }
  } finally {
    cleanup(run.directory);
  }
});

test('skill source files contain no Chinese characters', () => {
  const textExtensions = new Set(['.json', '.md', '.mjs']);
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory)) {
      if (entry === '.git') continue;
      const path = join(directory, entry);
      if (statSync(path).isDirectory()) visit(path);
      else if (textExtensions.has(entry.slice(entry.lastIndexOf('.')))) files.push(path);
    }
  };
  visit(resolve('.'));
  for (const file of files) {
    const relativePath = file.slice(resolve('.').length + 1).replaceAll('\\', '/');
    if (relativePath.startsWith('references/recipe-examples/')) continue;
    assert.doesNotMatch(readFileSync(file, 'utf8'), /[\u3400-\u9fff]/u, `${file} contains Chinese characters`);
  }
});

test('rejects non-English CJK text in generated IR', () => {
  const run = runCompiler({
    mode: 'replace',
    sections: [{
      id: 'english-only',
      height: 160,
      children: [{ type: 'text', id: 'copy', text: '\u4f60\u597d', x: 20, y: 40, w: 346 }],
    }],
  });
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /English-only/);
  } finally {
    cleanup(run.directory);
  }
});

function canonicalFixture(children = [{ type: 'text', id: 'title', text: 'Hello', x: 20, y: 20, w: 300 }], extra = {}) {
  const seed = runCompiler({ mode: 'replace', sections: [{ id: 'hero', height: 400, children }], ...extra });
  try {
    assert.equal(seed.execution.status, 0, seed.execution.stderr);
    return JSON.parse(readFileSync(seed.canonicalPath, 'utf8'));
  } finally { cleanup(seed.directory); }
}

function patchFixture(canonical, operations, extra = {}) {
  return runCompiler({ mode: 'patch', operations, ...extra }, JSON.stringify(canonical));
}

test('line compiles the complete editor contract and can be patched', () => {
  const canonical = canonicalFixture([{ type: 'line', id: 'rule', x: 20, y: 30, w: 240, h: 2,
    rotate: 30, opacity: 0.5, bgColor: '#123456', borderStyle: 'dashed', link: 'https://unico.test' }]);
  const rule = canonical.designJson[0].field.structure.child.component_list.value[0];
  assert.equal(rule.field.structure.label, 'Line Content');
  assert.equal(rule.field.styles.label, 'Line Style');
  assert.equal(rule.field.styles.child.rotate.type, 'angle');
  assert.equal(rule.field.styles.child.rotate.value, 30);
  assert.equal(rule.field.styles.child.opacity.value, 0.5);
  assert.equal(rule.field.styles.child.bgColor.value, '#123456');
  assert.equal(rule.field.styles.child.customCSS.value, '');
  assert.equal(rule.field.structure.child.link.value.url, 'https://unico.test');
  const run = patchFixture(canonical, [{ op: 'update', id: 'rule', changes: { rotate: 45, opacity: 0.8, link: { page: '', url: '', type: 'external', serviceId: '', productId: '' } } }]);
  try { assert.equal(run.execution.status, 0, run.execution.stderr); } finally { cleanup(run.directory); }
});

test('patch rejects text outside bounds, negative sections and long text without overwriting canonical', () => {
  const canonical = canonicalFixture();
  for (const operation of [
    { op: 'update', id: 'title', changes: { x: 999, y: 999 } },
    { op: 'update', id: 'hero', changes: { height: -10 } },
    { op: 'update', id: 'title', changes: { text: 'Long copy '.repeat(500) } },
    { op: 'update', id: 'title', changes: { w: -20 } },
    { op: 'update', id: 'title', changes: { paddingBlock: 300 } },
  ]) {
    const run = patchFixture(canonical, [operation]);
    try {
      assert.equal(run.execution.status, 1);
      assert.equal(run.result.validation.passed, false);
      assert.equal(readFileSync(run.canonicalPath, 'utf8'), JSON.stringify(canonical));
    } finally { cleanup(run.directory); }
  }
});

test('patch validates a whole batch after the container has been resized', () => {
  const canonical = canonicalFixture();
  const run = patchFixture(canonical, [
    { op: 'update', id: 'title', changes: { y: 500 } },
    { op: 'update', id: 'hero', changes: { height: 700 } },
  ]);
  try { assert.equal(run.execution.status, 0, run.execution.stderr); } finally { cleanup(run.directory); }
});

test('patch uses the actual tab container and preserves unrelated legacy layout warnings', () => {
  const canonical = canonicalFixture([{ type: 'tabs', id: 'tabs', x: 0, y: 0, w: 300, h: 300,
    tabs: [{ title: 'Overview', height: 120, children: [{ type: 'text', id: 'tab-title', text: 'Overview', x: 10, y: 10, w: 260 }] }] }], { explicitComponents: ['tabs'] });
  const run = patchFixture(canonical, [{ op: 'update', id: 'tab-title', changes: { y: 150 } }]);
  const legacy = canonicalFixture();
  legacy.designJson[0].field.structure.child.component_list.value[0].field.styles.child.left.value = 500;
  const preserved = patchFixture(legacy, [{ op: 'update', id: 'title', changes: { color: '#123456' } }]);
  const worsened = patchFixture(legacy, [{ op: 'update', id: 'title', changes: { x: 600 } }]);
  try {
    assert.equal(run.execution.status, 1);
    assert.match(run.result.validation.errors.join('\n'), /tabs\/tab1/);
    assert.equal(preserved.execution.status, 0, preserved.execution.stderr);
    assert.ok(preserved.result.validation.warnings.some((warning) => warning.includes('legacy layout')));
    assert.equal(worsened.execution.status, 1);
  } finally { [run, preserved, worsened].forEach(({ directory }) => cleanup(directory)); }
});

test('patch rejects new overlaps and background covering', () => {
  const canonical = canonicalFixture([
    { type: 'text', id: 'title', text: 'Hello', x: 20, y: 20, w: 300 },
    { type: 'text', id: 'body', text: 'World', x: 20, y: 120, w: 300 },
    { type: 'rectangle', id: 'plate', x: 20, y: 250, w: 300, h: 80, autoFitContent: false, zIndex: 0 },
  ]);
  for (const operation of [
    { op: 'update', id: 'body', changes: { y: 20 } },
    { op: 'update', id: 'plate', changes: { y: 20, zIndex: 10 } },
    { op: 'update', id: 'hero', changes: { height: 100 } },
  ]) {
    const run = patchFixture(canonical, [operation]);
    try { assert.equal(run.execution.status, 1); } finally { cleanup(run.directory); }
  }
});

test('patch replacements require image evidence and explicit component declarations', () => {
  const canonical = canonicalFixture();
  const imageOperation = { op: 'replace', id: 'title', component: { type: 'img', src: verifiedImageUrl, fit: 'cover', x: 20, y: 20, w: 120, h: 100 } };
  const ratingOperation = { op: 'replace', id: 'title', component: { type: 'rating', rating: '5', reviewCount: '100', x: 20, y: 20, w: 250, h: 60 } };
  const missingAsset = patchFixture(canonical, [imageOperation]);
  const missingDeclaration = patchFixture(canonical, [ratingOperation]);
  const accepted = patchFixture(canonical, [ratingOperation], { explicitComponents: ['rating'] });
  try {
    assert.equal(missingAsset.execution.status, 1);
    assert.match(missingAsset.result.validation.errors.join('\n'), /assetManifest/);
    assert.equal(missingDeclaration.execution.status, 1);
    assert.match(missingDeclaration.result.validation.errors.join('\n'), /explicitly requested/);
    assert.equal(accepted.execution.status, 0, accepted.execution.stderr);
  } finally { [missingAsset, missingDeclaration, accepted].forEach(({ directory }) => cleanup(directory)); }
});

test('asset evidence survives patch rounds and URL changes require new evidence', () => {
  const canonical = canonicalFixture([{ type: 'img', id: 'photo', src: verifiedImageUrl, fit: 'cover', x: 20, y: 20, w: 120, h: 100 }], { assetManifest: [verifiedAsset] });
  const first = patchFixture(canonical, [{ op: 'update', id: 'photo', changes: { radius: 12 } }]);
  const second = patchFixture(first.result, [{ op: 'update', id: 'photo', changes: { radius: 16 } }]);
  const newUrl = 'https://cdn.unico.test/new-image.jpg';
  const rejected = patchFixture(canonical, [{ op: 'update', id: 'photo', changes: { src: newUrl } }]);
  const replacementAsset = { ...verifiedAsset, directUrl: newUrl };
  const accepted = patchFixture(canonical, [{ op: 'update', id: 'photo', changes: { src: newUrl } }], { assetManifest: [replacementAsset] });
  try {
    for (const run of [first, second]) {
      assert.equal(run.execution.status, 0, run.execution.stderr);
      assert.deepEqual(run.result.assetManifest, [verifiedAsset]);
      assert.deepEqual(JSON.parse(readFileSync(run.canonicalPath)).assetManifest, [verifiedAsset]);
    }
    assert.equal(rejected.execution.status, 1);
    assert.match(rejected.result.validation.errors.join('\n'), /assetManifest/);
    assert.equal(accepted.execution.status, 0, accepted.execution.stderr);
    assert.deepEqual(accepted.result.assetManifest, [replacementAsset]);
  } finally { [first, second, rejected, accepted].forEach(({ directory }) => cleanup(directory)); }
});

test('legacy image evidence may be missing while unchanged; updated evidence wins by URL', () => {
  const canonical = canonicalFixture([{ type: 'img', id: 'photo', src: verifiedImageUrl, fit: 'cover', x: 20, y: 20, w: 120, h: 100 }], { assetManifest: [verifiedAsset] });
  delete canonical.assetManifest;
  const old = patchFixture(canonical, [{ op: 'update', id: 'photo', changes: { radius: 12 } }]);
  const updatedAsset = { ...verifiedAsset, verifiedAt: '2026-10-23', author: 'Verified contributor' };
  const updated = patchFixture({ ...canonical, assetManifest: [verifiedAsset] }, [{ op: 'update', id: 'photo', changes: { radius: 16 } }], { assetManifest: [updatedAsset] });
  try {
    assert.equal(old.execution.status, 0, old.execution.stderr);
    assert.ok(old.result.validation.warnings.some((warning) => warning.includes('legacy image')));
    assert.equal(updated.execution.status, 0, updated.execution.stderr);
    assert.deepEqual(updated.result.assetManifest, [updatedAsset]);
  } finally { [old, updated].forEach(({ directory }) => cleanup(directory)); }
});

test('single-use business components remain unique after patch replacement', () => {
  const run = runCompiler({ mode: 'replace', sections: [
    { id: 'a', children: [{ type: 'map', id: 'map', embedUrl: 'https://maps.unico.test/embed' }] },
    { id: 'b', children: [{ type: 'text', id: 'title', text: 'Contact', x: 20, y: 20, w: 300 }] },
  ] });
  let patch;
  try {
    assert.equal(run.execution.status, 0, run.execution.stderr);
    patch = patchFixture(run.result, [{ op: 'replace', id: 'b', component: { type: 'map', id: 'other-map', embedUrl: 'https://maps.unico.test/embed' } }]);
    assert.equal(patch.execution.status, 1);
    assert.match(patch.result.validation.errors.join('\n'), /at most once/);
  } finally { cleanup(run.directory); if (patch) cleanup(patch.directory); }
});

test('short text-only pages compile with identical guidance for missing and empty canonical', () => {
  const ir = { mode: 'extend', sections: [{ id: 'short', children: [{ type: 'text', id: 'title', text: 'Welcome', x: 20, y: 20, w: 300 }] }] };
  const absent = runCompiler(ir);
  const empty = runCompiler(ir, JSON.stringify({ designJson: [], message: '' }));
  try {
    assert.equal(absent.execution.status, 0, absent.execution.stderr);
    assert.equal(empty.execution.status, 0, empty.execution.stderr);
    assert.deepEqual(absent.result.validation.warnings, empty.result.validation.warnings);
    assert.ok(empty.result.validation.warnings.some((warning) => warning.includes('3 distinct')));
    assert.ok(empty.result.validation.warnings.some((warning) => warning.includes('5 purposeful')));
  } finally { [absent, empty].forEach(({ directory }) => cleanup(directory)); }
});

test('text height grows with real padding and letter spacing without a height control', () => {
  const compile = (extra) => runCompiler({ mode: 'replace', sections: [{ id: 'text-size', children: [{ type: 'text', id: 'title', text: 'A readable title with several words '.repeat(20), x: 0, y: 0, w: 200, fontSize: 16, paddingInline: 0, paddingBlock: 0, ...extra }] }] });
  const plain = compile({});
  const padded = compile({ paddingInline: 30, paddingBlock: 20 });
  const tracked = compile({ letterSpacing: 5 });
  try {
    for (const run of [plain, padded, tracked]) assert.equal(run.execution.status, 0, run.execution.stderr);
    const height = (run) => run.result.designJson[0].field.styles.child.height.value;
    assert.ok(height(padded) > height(plain));
    assert.ok(height(tracked) > height(plain));
    assert.equal('height' in padded.result.designJson[0].field.structure.child.component_list.value[0].field.styles.child, false);
  } finally { [plain, padded, tracked].forEach(({ directory }) => cleanup(directory)); }
});

test('replacement layout is validated after all batch operations', () => {
  const run = patchFixture(canonicalFixture(), [
    { op: 'replace-section', id: 'hero', section: { id: 'hero', height: 10,
      children: [{ type: 'text', id: 'title', text: 'Updated', x: 20, y: 999, w: 300 }] } },
    { op: 'update', id: 'title', changes: { y: 20 } },
    { op: 'update', id: 'hero', changes: { height: 400 } },
  ]);
  try { assert.equal(run.execution.status, 0, run.execution.stderr); } finally { cleanup(run.directory); }
});

test('replacement exceptions follow generated component IDs including tabs', () => {
  const run = patchFixture(canonicalFixture(), [{ op: 'replace-section', id: 'hero', section: {
    height: 500, children: [
      { type: 'text', text: 'Intentional overlap', x: 20, y: 20, w: 300, allowOverlap: true },
      { type: 'text', text: 'Foreground', x: 20, y: 20, w: 300 },
      { type: 'line', x: 999, y: 100, w: 100, allowOverflow: true },
      { type: 'tabs', x: 0, y: 180, w: 386, h: 300, tabs: [{ title: 'One', height: 260,
        children: [{ type: 'text', text: 'Intentional bleed', x: 999, y: 0, w: 100, allowOverflow: true }] }] },
    ],
  } }], { explicitComponents: ['tabs'] });
  try { assert.equal(run.execution.status, 0, run.execution.stderr); } finally { cleanup(run.directory); }
});

test('line patch rejects invalid angle and opacity and keeps canonical intact', () => {
  const canonical = canonicalFixture([{ type: 'line', id: 'rule', x: 20, y: 30, w: 240, h: 2 }]);
  for (const changes of [{ rotate: 'invalid' }, { opacity: 2 }]) {
    const run = patchFixture(canonical, [{ op: 'update', id: 'rule', changes }]);
    try {
      assert.equal(run.execution.status, 1);
      assert.equal(readFileSync(run.canonicalPath, 'utf8'), JSON.stringify(canonical));
    } finally { cleanup(run.directory); }
  }
});

test('image URL updates reject empty and local sources without changing canonical', () => {
  const canonical = canonicalFixture([{ type: 'img', id: 'photo', src: verifiedImageUrl, fit: 'cover', x: 20, y: 20, w: 300, h: 200 }], { assetManifest: [verifiedAsset] });
  for (const src of ['', '/tmp/photo.jpg']) {
    const run = patchFixture(canonical, [{ op: 'update', id: 'photo', changes: { src } }]);
    try {
      assert.equal(run.execution.status, 1);
      assert.match(run.result.validation.errors.join('\n'), /HTTP\(S\)/);
      assert.equal(readFileSync(run.canonicalPath, 'utf8'), JSON.stringify(canonical));
    } finally { cleanup(run.directory); }
  }
});

test('asset evidence covers nested images, avatars, logos, backgrounds, banners and URL icons', () => {
  const types = ['brand-navbar', 'coupon', 'store-information', 'service-list', 'navigation', 'banner'];
  const sections = types.map((type, index) => ({ id: `block-${index}`, children: [{ type, id: type,
    logo: verifiedImageUrl, backgroundImage: verifiedImageUrl, storeName: 'Shop',
    items: [{ pic: verifiedImageUrl, icon: verifiedImageUrl, text: 'Visit', label: 'Visit' }],
  }] }));
  sections.push({ id: 'nested', height: 400, children: [{ type: 'tabs', id: 'tabs', x: 0, y: 0, w: 386, h: 350,
    tabs: [{ height: 300, children: [
      { type: 'person-profile', id: 'person', name: 'A Person', avatar: verifiedImageUrl, x: 0, y: 0, w: 300, h: 100 },
      { type: 'img', id: 'nested-photo', src: verifiedImageUrl, fit: 'contain', x: 0, y: 150, w: 100, h: 100 },
    ] }] }] });
  const seed = runCompiler({ mode: 'replace', sections, explicitComponents: [...types, 'tabs', 'person-profile'], assetManifest: [verifiedAsset] });
  let edited;
  let removed;
  let legacy;
  try {
    assert.equal(seed.execution.status, 0, seed.execution.stderr);
    edited = patchFixture(seed.result, [{ op: 'update', id: 'person', changes: { name: 'Updated Person' } }]);
    assert.equal(edited.execution.status, 0, JSON.stringify(edited.result.validation));
    assert.deepEqual(edited.result.assetManifest, [verifiedAsset]);
    const withoutEvidence = { ...edited.result };
    delete withoutEvidence.assetManifest;
    legacy = patchFixture(withoutEvidence, [{ op: 'update', id: 'person', changes: { name: 'Legacy Person' } }]);
    assert.equal(legacy.execution.status, 0, legacy.execution.stderr);
    assert.equal(legacy.result.validation.warnings.filter((warning) => warning.includes('legacy image')).length, 11);
    removed = patchFixture(edited.result, [
      { op: 'replace-section', id: 'nested', section: { children: [{ type: 'text', text: 'No images remain', x: 20, y: 20, w: 300 }] } },
      ...edited.result.designJson.filter(({ id }) => id !== 'nested').map(({ id }) => ({ op: 'delete', id })),
    ]);
    assert.equal(removed.execution.status, 0, removed.execution.stderr);
    assert.deepEqual(removed.result.assetManifest, []);
    assert.deepEqual(JSON.parse(readFileSync(removed.canonicalPath, 'utf8')).assetManifest, []);
  } finally {
    cleanup(seed.directory);
    if (edited) cleanup(edited.directory);
    if (removed) cleanup(removed.directory);
    if (legacy) cleanup(legacy.directory);
  }
});
