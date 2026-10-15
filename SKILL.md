---
name: unico-export
description: Design, edit, validate, and export polished mobile pages for Unico DND from natural-language briefs using Unico Design IR and the local compiler. Use for direct page creation or editing; use the measured HTML workflow for source-faithful reproduction.
---

# Unico Export

Turn the brief into a complete, distinctive mobile page whose content, imagery, and art direction are visible in the emitted JSON. The brief and supplied materials are factual sources; use design judgment for visual choices, never to invent business facts.

## Route the task

- **New page or full redesign:** read `references/design-playbook.md`, `references/component-recipes.md`, and `references/component-contract.md`. Read `references/visual-recipes.md` for a matching case direction and `references/verified-image-sources.md` when sourcing or resolving image assets.
- **Extend an existing page:** inspect the canonical JSON, preserve unrelated components, and add only what the requested change needs. Keep the existing design language unless asked to change it.
- **Reproduce existing HTML:** use the active HTML conversion workflow. Its rendered appearance, copy, assets, and measured geometry are the source of truth; do not redesign it.

## Generate and review

1. Inspect available user assets and the current canonical page. Extract the audience, page goal, primary action, required information, explicit style cues, and confirmed facts.
2. For a direct design, create a content outline and visual-cue map before IR. Every new page or full redesign needs at least five purposeful content modules in addition to its separately designed Header; name the Header section `Header` so the compiler excludes it. Standard brand, community, service, and event pages should feel complete by default: usually 6–9 purpose-built sections and roughly 50–60 meaningful visible text runs. Treat the larger counts as a completeness baseline, not filler quota; respect explicitly short briefs and do not count repeated decorative text as content. Expand a sparse first-pass outline when the source material supports it.
3. Proactively search for suitable imagery and generate raster concepts for backgrounds, textures, icons, or illustrations when they materially strengthen the page. Plan a hero image and at least two distinct supporting image roles. Every new page or full redesign must compile with at least three distinct, topic-relevant image URLs. Verify the current direct URL, image media type, and commercial-use evidence under `verified-image-sources.md`; keep local generated files as art-direction concepts outside the final IR. If verification fails, find a suitable replacement or report that the page cannot yet be exported; do not compile empty/local staging image sources.
4. Plan the page as `section → recipe IDs → content/assets`. Select 2–4 suitable combinations from `references/component-recipes.md`, adapting their relationships and geometry to the current brief. Prefer simple constructions by default and use at most one expressive/complex treatment unless the brief calls for more. Map each explicit style cue to recipe/component IDs and fields; do not claim a style in `designProfile` unless the JSON visibly implements it. Recipes guide construction but do not replace the playbook's minimum content and image requirements.
5. Write compact `unico-design-ir.json` using only `references/component-contract.md`. Use `mode: "extend"` for ordinary edits and `mode: "replace"` only for a requested full redesign. Preserve the English-only generated-string constraint.
6. Compile with `compiler/unico-ir-compiler.mjs`. Fix IR errors, inspect warnings, and audit the emitted JSON for at least three distinct image resources, five non-Header content modules, content scale, style-cue evidence, type/color/layout rhythm, overlap, and clipping. Inspect a rendered preview when available; compiler success alone is not visual approval.
7. Deliver the complete canonical `unico-page.json` envelope and compatibility `unico-export-result.json`. Report staged assets and any visual effects that could not be verified.

The canonical page is a complete envelope, not a patch:

```json
{
  "designJson": [],
  "message": "Short summary"
}
```

## References

- [`references/design-playbook.md`](references/design-playbook.md) — content baseline, visual-cue mapping, image planning, composition, and the post-compile completion audit.
- [`references/component-recipes.md`](references/component-recipes.md) — adaptable component combinations for image modules, editorial headers, event cards, service rows, steps, FAQs, and footers.
- [`references/visual-recipes.md`](references/visual-recipes.md) — concrete construction moves extracted from repository cases; adapt the relationships to the brief.
- [`references/component-contract.md`](references/component-contract.md) — supported IR fields and compiler constraints.
- [`references/verified-image-sources.md`](references/verified-image-sources.md) — commercial-use evidence and URL verification for network images.

For source-faithful HTML conversion, follow the separate `html-to-design-json` workflow.
