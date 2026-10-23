---
name: unico-export
description: Design, edit, validate, and export polished mobile pages for Unico DND from natural-language briefs using Unico Design IR and the local compiler. Use for direct page creation or editing; use the measured HTML workflow for source-faithful reproduction.
---

# Unico Export

Turn the brief into a complete, distinctive mobile page whose content, imagery, and art direction are visible in the emitted JSON. The brief and supplied materials are factual sources; use design judgment for visual choices, never to invent business facts.

## Route the task

- **New page or full redesign:** read `references/design-playbook.md` and the relevant component contracts. Use the index in `references/component-recipes.md` to select only the recipes needed for the brief. Read `references/visual-recipes.md` only for a matching direction, and asset-source references only when adding those assets.
- **Focused changes to existing content:** read `references/partial-editing.md` and the relevant component contracts. Use `mode: "patch"` for copy, styling, deletion, component replacement, or section recomposition; do not recreate unrelated sections.
- **Add a new section:** use `mode: "extend"`; inspect the canonical JSON, preserve unrelated components, and add only what the requested change needs. Keep the existing design language unless asked to change it.
- **Reproduce existing HTML:** use the active HTML conversion workflow. Its rendered appearance, copy, assets, and measured geometry are the source of truth; do not redesign it.

## Generate and review

1. Inspect available user assets and the current canonical page. Extract the audience, page goal, primary action, required information, explicit style cues, and confirmed facts.
2. For a direct design, outline the content and visual cues required by the brief. A broad landing page may benefit from five or more content modules, 6–9 sections, and roughly 50–60 meaningful text runs. These are references, not quotas. Short briefs, single-purpose pages, and text-only pages are valid; do not invent facts or pad content. Name a separate masthead section `Header` so composition metrics can identify it.
3. Use user assets first, then source verified images when they improve the page. For a broad visual page, consider a hero and two distinct supporting images; add a purposeful small graphic only when it serves the brief. Image counts are advisory. Read `verified-image-sources.md` for photographs and `small-visual-assets.md` for small graphics. Every new or replaced image must have a verified HTTP(S) direct URL and matching `assetManifest` evidence. Unchanged legacy images without evidence produce warnings during focused edits. Standalone remote SVG is allowed; inline SVG, data URLs, SVGZ, empty sources, and local files are not. Keep generated local concepts outside final IR until they have usable URLs and evidence.
4. Map each section to its content, assets, and any relevant recipe IDs. For broad pages, 2–4 adaptable recipes may be useful; focused or short pages need only the combinations they use. Implement each explicit visual cue with actual components and supported fields, or report its closest supported substitute. Keep designProfile claims consistent with the emitted JSON.
5. Write compact `unico-design-ir.json` using supported fields from `references/component-contract.md`. Use `patch` for existing content, `extend` for new sections, and `replace` only for a requested full redesign. Generated copy remains English-only.
6. Compile with `compiler/unico-ir-compiler.mjs`. Fix errors and review warnings against the brief. Quantity warnings do not block short or text-only pages. Audit content completeness, actual imagery, style cues, typography, overlap, and clipping. Inspect a rendered preview when available; compiler success alone is not visual approval.
7. Deliver the complete canonical `unico-page.json` envelope and compatibility `unico-export-result.json`. Both retain available assetManifest evidence across edits. Report any visual effects or asset checks that remain unverified.

The canonical page is a complete envelope, not a patch:

```json
{
  "designJson": [],
  "message": "Short summary"
}
```

## References

- [`references/partial-editing.md`](references/partial-editing.md) — deterministic updates, replacements, deletion, and batch validation for existing pages.
- [`references/design-playbook.md`](references/design-playbook.md) — content baseline, visual-cue mapping, image planning, composition, and the post-compile completion audit.
- [`references/component-recipes.md`](references/component-recipes.md) — adaptable component combinations for image modules, editorial headers, event cards, service rows, steps, FAQs, horizontal image rails, and footers.
- [`references/visual-recipes.md`](references/visual-recipes.md) — concrete construction moves extracted from repository cases; adapt the relationships to the brief.
- [`references/component-contract.md`](references/component-contract.md) — supported IR fields and compiler constraints.
- [`references/verified-image-sources.md`](references/verified-image-sources.md) — commercial-use evidence and URL verification for network images.
- [`references/small-visual-assets.md`](references/small-visual-assets.md) — search, direct-file format verification, and license recording for optional, purposeful graphics.

For source-faithful HTML conversion, follow the separate `html-to-design-json` workflow.
