# unico-export

The primary Open Design skill for creating and editing mobile pages for Unico DND. It converts a natural-language brief into compact Unico Design IR, then uses the bundled compiler to produce the complete import-ready page JSON.

## Use this package for

- New mobile pages designed directly from a brief.
- Focused edits to an existing canonical Unico page.
- Full redesigns when the user explicitly requests them.

Use `html-to-design-json` for source-faithful HTML reproduction; that workflow treats rendered HTML as the visual source of truth.

## Workflow at a glance

1. Read the current canonical page when present.
2. For a new page or redesign, use the fast path in `SKILL.md`: work from the brief and supplied assets, and consult a case only for a named reference or unresolved composition question. Read only the relevant contract/recipe sections. Generate missing placeholder visuals with the model's image-generation capability; do not search for candidates. Keep failed or over-limit image slots visible as same-size color blocks. Search for sourced images only when explicitly required. For focused edits, use `references/partial-editing.md` when operation semantics are unclear.
3. Write IR using the supported fields in `references/component-contract.md`.
4. Compile with `compiler/unico-ir-compiler.mjs`; fix errors in IR and review warnings.
5. Deliver the complete `unico-page.json` envelope and `unico-export-result.json` compatibility artifact.

The compiler checks schema and layout invariants. It cannot judge whether the design fulfills the brief; review the changed sections and primary action, and check full-page hierarchy for new pages. Use a rendered preview when available and report when visual rendering remains unverified.

## Package contents

| Path | Purpose |
| --- | --- |
| `SKILL.md` | Task routing and generation workflow. |
| `references/asset-workflow.md` | Optional bounded asset sourcing, shared Gateway helper/cache and draft fallback. |
| `references/case-library.md` | Selection and reading workflow for four full-page studies; source reuse boundaries and authorized placeholder mode. |
| `references/cases/` | Honour Tile Society, Mahjong Club, North Brooklyn Chess and SoCal Boba Run Club: original screenshot, complete source JSON, case analysis, section map, asset-slot plan and geometry-only placeholder page. |
| `references/design-playbook.md` | Main design method for turning natural-language requests into implemented visual decisions. |
| `references/component-recipes.md` | Ready-to-adapt component combinations for image modules, premium editorial showcases and text/action card variants, icon-led information cards, events, steps, FAQs, horizontal image rails, and page endings. |
| `references/visual-recipes.md` | Optional patterns extracted from repository examples. |
| `references/component-contract.md` | IR component schema, compiler constraints, and field-level invariants. |
| `references/verified-image-sources.md` | Network image licensing and verification requirements. |
| `references/small-visual-assets.md` | Search, format verification, provenance, and license workflow for small raster or standalone SVG graphics. |
| `references/recipe-examples/` | Archived original Unico component JSON for approved reusable combinations such as R21b, R21c, R23b, and R24–R29b. |
| `compiler/unico-ir-compiler.mjs` | Deterministic IR-to-Unico JSON compiler. |
| `unico-page.json` | Example canonical page envelope. |

Generated page strings and IR copy are English-only. Image and content-module counts are quality guidance, not export requirements: concise and text-only pages are supported. Every image actually emitted must have a verified direct HTTP(S) image URL and matching license evidence. Use photographs and small graphics when they serve the brief; never add filler to satisfy a count. Standalone remote SVG is supported; empty/local/data sources are rejected.

Bundled cases are design references, not reusable photographs, logos, posters, business facts or current compiler fixtures. For a draft, reuse supplied media, generate up to three simple replacement-ready placeholder visuals for missing image slots, and represent remaining slots with editable geometry/text; report pending replacements and booking facts. The bundled `page.placeholders.json` files retain historical source copy and geometry for study; they have not been rendered or validated and are not publish-ready templates. Gateway's existing local source snapshots include the entire skill resource tree, so these relative-path references travel with the selected skill version.

Focused edits use `mode: "patch"`; adding sections uses `extend`; a requested full redesign uses `replace`. Read `references/partial-editing.md` for patch operations. The compiler validates the final batch before updating the canonical page, preserves available `assetManifest` evidence in both output envelopes, and requires evidence for new or changed image resources. Unchanged legacy resources without evidence produce warnings.

## Versioning

`.claude-plugin/plugin.json` is the source of truth for the plugin version, and its version must match `open-design.json`. Follow Semantic Versioning: increment PATCH for non-breaking fixes, MINOR for new or expanded generation behavior, and MAJOR for breaking IR or output-contract changes. Any behavior change to `SKILL.md`, `compiler/`, `references/`, or `open-design.json` must advance the version. The `Version policy` GitHub Actions check enforces the bump and manifest consistency for pull requests.

`unico-export-no-uiux` is a separate package with its own compiler and copied references. Keep the design playbook and visual recipes aligned when changing shared generation guidance; do not assume the compilers are interchangeable.

## Faster default workflow (1.25.0)

Routine generation skips case screenshot inspection, external image discovery, separate planning documents and repeated full-page audits. Those steps remain available when the brief or a specific design question needs them. For missing image slots, the model's image-generation capability creates up to three simple, replacement-ready visuals without searching for candidates; every remaining or failed slot stays visible as a same-size editable solid-color placeholder. This shortens the default path while preserving explicit asset requirements, compiler validation, and factual constraints.

## Parallel asset workflow

A single compact content/composition plan replaces separate cue ledgers and storyboards. Ordinary generation uses the model's image-generation capability for missing placeholders and never calls the Gateway search helper. Use the companion Gateway search helper only when authentic imagery or a user-specified source is explicitly required; selected candidates must be checked before their manifests enter IR. Capability `assetSearch: 1` opts the selected Skill into that helper and bounded native delegation configuration. Existing runtimes without it use the documented bounded manual fallback; no nested CLI/task is spawned to emulate missing subagent tools.

Sourcing retains its two-query, four-file-check and forty-five-second budget when explicitly needed. Placeholder generation uses the existing `generatedAssets` capability, with at most three calls per turn and no retries; failures or unavailable generation fall back to same-size editable color blocks without removing image regions. Real-image requirements, source restrictions and explicit instructions against AI generation remain in force.
