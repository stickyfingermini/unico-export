# unico-export

The primary Open Design skill for creating and editing mobile pages for Unico DND. It converts a natural-language brief into compact Unico Design IR, then uses the bundled compiler to produce the complete import-ready page JSON.

## Use this package for

- New mobile pages designed directly from a brief.
- Focused edits to an existing canonical Unico page.
- Full redesigns when the user explicitly requests them.

Use `html-to-design-json` for source-faithful HTML reproduction; that workflow treats rendered HTML as the visual source of truth.

## Workflow at a glance

1. Read the current canonical page when present.
2. For a new page or redesign, use `references/design-playbook.md` to plan content and map each explicit style cue to visible IR components. Select relevant combinations from `references/component-recipes.md`; 2–4 may help broad pages, while short pages need fewer. Load asset references only when photos or small graphics serve the brief. For focused edits, read `references/partial-editing.md` and the relevant component contracts.
3. Write IR using the supported fields in `references/component-contract.md`.
4. Compile with `compiler/unico-ir-compiler.mjs`; fix errors in IR and review warnings.
5. Deliver the complete `unico-page.json` envelope and `unico-export-result.json` compatibility artifact.

The compiler checks schema and layout invariants. It cannot judge whether the design fulfills the brief; audit the compiled JSON for content scale, imagery, and visible evidence of every style cue, then review a rendered preview when available and report when visual rendering remains unverified.

## Package contents

| Path | Purpose |
| --- | --- |
| `SKILL.md` | Task routing and generation workflow. |
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

Focused edits use `mode: "patch"`; adding sections uses `extend`; a requested full redesign uses `replace`. Read `references/partial-editing.md` for patch operations. The compiler validates the final batch before updating the canonical page, preserves available `assetManifest` evidence in both output envelopes, and requires evidence for new or changed image resources. Unchanged legacy resources without evidence produce warnings.

## Versioning

`.claude-plugin/plugin.json` is the source of truth for the plugin version, and its version must match `open-design.json`. Follow Semantic Versioning: increment PATCH for non-breaking fixes, MINOR for new or expanded generation behavior, and MAJOR for breaking IR or output-contract changes. Any behavior change to `SKILL.md`, `compiler/`, `references/`, or `open-design.json` must advance the version. The `Version policy` GitHub Actions check enforces the bump and manifest consistency for pull requests.

`unico-export-no-uiux` is a separate package with its own compiler and copied references. Keep the design playbook and visual recipes aligned when changing shared generation guidance; do not assume the compilers are interchangeable.
