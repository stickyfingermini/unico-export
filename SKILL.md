---
name: unico-export
description: Design, edit, validate, and export polished mobile pages for Unico DND from natural-language briefs using Unico Design IR and the local compiler. Use for direct page creation or editing; use the measured HTML workflow for source-faithful reproduction.
---

# Unico Export

Turn the brief into a complete, distinctive mobile page whose content, imagery, and art direction are visible in the emitted JSON. The brief and supplied materials are factual sources; use design judgment for visual choices, never to invent business facts.

## Route the task

- **New page or full redesign:** select a matching primary case through `references/case-library.md` when useful; read its `case.md` and open its `screenshot.png`. Load section maps/source JSON only for specific geometry questions. Use `references/design-playbook.md`, the component contract, and only needed recipes. Reuse an already inspected case and existing plan during follow-up edits; a mismatched case is not mandatory.
- **Focused changes to existing content:** read `references/partial-editing.md` and the relevant component contracts. Use `mode: "patch"` for copy, styling, deletion, component replacement, or section recomposition; do not recreate unrelated sections.
- **Add a new section:** use `mode: "extend"`; inspect the canonical JSON, preserve unrelated components, and add only what the requested change needs. Keep the existing design language unless asked to change it.
- **Reproduce existing HTML:** use the active HTML conversion workflow. Its rendered appearance, copy, assets, and measured geometry are the source of truth; do not redesign it.

## Generate and review

1. Inspect the brief, user assets and canonical page. Form **one compact plan**: goal, audience, primary action, one art-direction sentence, selected case/borrowed relationships when relevant, then one row per section covering visitor question/content → composition and visible cues → image role/action/missing facts. Keep facts and design choices distinct. Do not create separate cue ledgers, storyboards and repeated planning documents. Do not invent event facts or transfer case brands, people, claims or media. If image viewing is unavailable, say the screenshot was not inspected.
2. Let visitor questions determine content and length; avoid section/text/image quotas and repeated claims. For complete new pages/full redesigns, design an editable masthead section named `Header` with brand, theme and useful action; use `brand-navbar` only for navigation. Honor explicit omission, do not add it during local edits, and do not reject valid fragments for a missing Header.
3. When imagery needs discovery, follow `references/asset-workflow.md`: delegate one independent sourcing task to a native subagent when available, using the shared `.agents/tools/search-assets.mjs` helper and its server-side cache. Continue composition with existing assets or native placeholders; gather suitable results before final compilation. Default helper budgets are four unique searches, six candidate checks and ninety seconds from first use, shared by all agents. Respect source restrictions and explicit real-image/no-placeholder requirements. Placeholder-only requests skip searches. Only explicit requests authorize AI generation under `references/generated-visuals.md`; missing assets and failed searches do not authorize it.
4. Implement the plan using supported fields and only relevant recipes: varied image proportions, offsets, whitespace, asymmetry, backplates, restrained overlaps or bleed as content calls for them. Explicit visual cues need visible components or a stated limitation/substitute. Keep important copy editable and designProfile concise and consistent with actual output; no decoration quota applies.
5. Write compact `unico-design-ir.json` using supported fields from `references/component-contract.md`. Existing canonical pages require an explicit mode. Use `mode: "patch"` with `op: "update"` for fields, `op: "replace-section"` for regional recomposition (rebuild the whole region and subtree), `mode: "extend"` for new sections, and `mode: "replace"` for a full redesign. Omitted mode never implicitly appends to an existing page. Generated copy remains English-only.
6. Compile with `compiler/unico-ir-compiler.mjs`. Fix errors and review relevant warnings; quantity warnings do not set content targets. Review changed sections, dependencies and the visitor action path against the single plan, using a rendered preview when available. Full-page work also reviews overall hierarchy and section rhythm. Do not routinely reread the entire canonical JSON or rerun standalone validation after a successful compile when Gateway already validates. Compiler success alone is not visual approval; report unverified effects and pending assets/facts honestly.
7. Deliver the complete canonical `unico-page.json` envelope and compatibility `unico-export-result.json`. Both retain available assetManifest evidence and intentional layoutHints across edits. The compiler exposes read-only `--validate-page <page> [baseline]` and `--capabilities`; validation reports passed/errors/warnings, level `full`, and version `1`. Canonical writes are atomic and invalid results keep the previous canonical. Old Skills without this contract can only receive basic validation from Gateway. Report any visual effects or asset checks that remain unverified.

In DND, preview with verified source URLs or signed Gateway generated-asset URLs. Generated previews expire after 24 hours by default; never leave those temporary links in the applied page. When the user clicks **Apply and end**, DND uploads newly introduced images/videos through its existing media backend, registers them under **Media Asset → AI Design**, and uses the stored URLs on the canvas. Do not upload during generation or ask the model for S3 credentials. Keep source-page/license evidence for sourced assets and real generation records for generated assets in `assetManifest`; after application, `directUrl` may be the user's storage URL and `originalUrl` identifies the original file. No image means no image-license check is needed.

The canonical page is a complete envelope, not a patch:

```json
{
  "designJson": [],
  "message": "Short summary"
}
```

## References

- [`references/asset-workflow.md`](references/asset-workflow.md) — parallel worker/main responsibilities, shared sourcing tool/cache, budgets and draft fallback.
- [`references/case-library.md`](references/case-library.md) — four complete screenshot/JSON studies, selective reading, adaptation records, non-reusable source assets and authorized placeholder drafts.
- [`references/generated-visuals.md`](references/generated-visuals.md) — generation helper, quota, provenance, fallback and Apply lifecycle.

- [`references/partial-editing.md`](references/partial-editing.md) — deterministic updates, replacements, deletion, and batch validation for existing pages.
- [`references/design-playbook.md`](references/design-playbook.md) — content baseline, visual-cue mapping, image planning, composition, and the post-compile completion audit.
- [`references/component-recipes.md`](references/component-recipes.md) — adaptable component combinations for image modules, editorial headers, event cards, service rows, steps, FAQs, horizontal image rails, and footers.
- [`references/visual-recipes.md`](references/visual-recipes.md) — concrete construction moves extracted from repository cases; adapt the relationships to the brief.
- [`references/component-contract.md`](references/component-contract.md) — supported IR fields and compiler constraints.
- [`references/verified-image-sources.md`](references/verified-image-sources.md) — commercial-use evidence and URL verification for network images.
- [`references/small-visual-assets.md`](references/small-visual-assets.md) — search, direct-file format verification, and license recording for optional, purposeful graphics.

For source-faithful HTML conversion, follow the separate `html-to-design-json` workflow.
