---
name: unico-export
description: Design, edit, validate, and export polished mobile pages for Unico DND from natural-language briefs using Unico Design IR and the local compiler. Use for direct page creation or editing; use the measured HTML workflow for source-faithful reproduction.
---

# Unico Export

Turn the brief into a complete, distinctive mobile page whose content, imagery, and art direction are visible in the emitted JSON. The brief and supplied materials are factual sources; use design judgment for visual choices, never to invent business facts.

## Route the task

- **New page or full redesign:** read `references/case-library.md` and select a matching primary case when useful. Read its `case.md` and actually open its `screenshot.png`; use `page-map.json` to locate relevant sections of the complete source JSON instead of loading every case. Then use `references/design-playbook.md`, the relevant component contracts, and only the needed recipes from `references/component-recipes.md` and `references/visual-recipes.md`. Read asset-source references only when sourcing those assets. A case outside the brief's direction is not mandatory.
- **Focused changes to existing content:** read `references/partial-editing.md` and the relevant component contracts. Use `mode: "patch"` for copy, styling, deletion, component replacement, or section recomposition; do not recreate unrelated sections.
- **Add a new section:** use `mode: "extend"`; inspect the canonical JSON, preserve unrelated components, and add only what the requested change needs. Keep the existing design language unless asked to change it.
- **Reproduce existing HTML:** use the active HTML conversion workflow. Its rendered appearance, copy, assets, and measured geometry are the source of truth; do not redesign it.

## Generate and review

1. Inspect available user assets and the current canonical page. Extract the audience, page goal, primary action, required information, explicit style cues, and confirmed facts. For case-guided work, record the selected case, concrete composition relationships to adapt, and source facts/assets that must be replaced. Bundled case screenshots and source JSON are study material; their media URLs, people, brands and claims are not reusable new-page content. If image viewing is unavailable, say the case screenshot was not inspected.
2. For a direct design, outline the content and visual cues required by the brief. A broad landing page may benefit from five or more content modules, 6–9 sections, and roughly 50–60 meaningful text runs. These are references, not quotas. Short briefs, single-purpose pages, and text-only pages are valid; do not invent facts or pad content. For every complete new page or full redesign, proactively create a separate masthead section named `Header`: express the brand, page theme and useful action. Build it with editable ordinary components; use `brand-navbar` only for real navigation. Local edits do not add a Header; honor an explicit omission. A missing Header is a quality warning, never a reason to reject a valid fragment.
3. Inspect user assets first and plan visual roles. Reuse suitable brand assets and authentic product/people photos; do not replace them with fictional subjects. If the user permits temporary placeholders, follow the placeholder mode in `references/case-library.md`: preserve planned visual roles with native geometry and editable labels, keep unsupported booking destinations unset, and deliver an explicitly unfinished-asset draft without searching or generating replacement imagery for those slots. Otherwise **default to public-web search for additional assets**, including backgrounds, textures, decorative cutouts, icons and illustrations; follow `references/verified-image-sources.md` and `references/small-visual-assets.md`. **Only generate images when the user explicitly requests AI image generation** for that asset or task. A request to generate a page, improve visuals or add a background does not itself request AI image generation. Provider configuration, helper availability and failed searches do not grant permission to generate. Honor later instructions to use search instead. For explicitly requested generation, read `references/generated-visuals.md`; when the Gateway exposes `.agents/tools/generate-visual.mjs`, use **0–3 auxiliary visuals per turn**, describing each visual's purpose, placement, ratio and style before calling. Keep body copy, prices, dates and CTA labels as editable text; raster text must not carry key information. Sourced images need verified HTTP(S) direct URLs and license evidence; generated images need the real Gateway generation record. Local/data/blob images and inline SVG cannot be final sources. Missing optional assets use suitable existing assets or native geometry and are reported; never switch from search to generation without the user's explicit request. A user-required key visual that remains missing means the design is incomplete, unless delivery is explicitly an approved placeholder draft; that draft is not publish-ready.
4. Map each section to its content, assets, and any relevant recipe IDs. Use active design with moderate variation: choose image proportions, offsets, whitespace, asymmetry, backplates, restrained overlaps or bleed according to content and brand. There is no maximum number of advanced recipes, mandatory image count or decoration quota. For broad pages, 2–4 adaptable recipes may be useful; focused or short pages need only the combinations they use. Implement each explicit visual cue with actual components and supported fields, or report its closest supported substitute. Keep designProfile claims consistent with the emitted JSON.
5. Write compact `unico-design-ir.json` using supported fields from `references/component-contract.md`. Existing canonical pages require an explicit mode. Use `mode: "patch"` with `op: "update"` for fields, `op: "replace-section"` for regional recomposition (rebuild the whole region and subtree), `mode: "extend"` for new sections, and `mode: "replace"` for a full redesign. Omitted mode never implicitly appends to an existing page. Generated copy remains English-only.
6. Compile with `compiler/unico-ir-compiler.mjs`. Fix errors and review warnings against the brief. Quantity warnings do not block short or text-only pages. Audit content completeness, actual imagery or approved placeholder roles, style cues, typography, overlap, and clipping. For case-guided work, compare the output with the selected composition relationships and visitor questions; a matching palette is insufficient. Inspect a rendered preview when available; compiler success alone is not visual approval. Name pending assets/facts in a placeholder draft without presenting them as completed content.
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
