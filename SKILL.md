---
name: unico-export
description: Design, edit, validate, and export polished mobile pages for Unico DND from natural-language briefs using Unico Design IR and the local compiler. Use for direct page creation or editing; use the measured HTML workflow for source-faithful reproduction.
---

# Unico Export

Turn the brief into a complete, distinctive mobile page whose content, imagery, and art direction are visible in the emitted JSON. The brief and supplied materials are factual sources; use design judgment for visual choices, never to invent business facts.

## Route the task

- **New page or full redesign:** use the fast path below by default. Consult one case only when the brief names a reference, requests a specific established direction, or a concrete composition question needs it. If selected, read its `case.md`; open the screenshot only when visual comparison will affect a decision. Load maps/source JSON only for a specific unresolved detail.
- **Focused changes to existing content:** read `references/partial-editing.md` only when the requested operation is unclear. Use `mode: "patch"` for copy, styling, deletion, component replacement, or section recomposition; do not recreate unrelated sections.
- **Add a new section:** use `mode: "extend"`; inspect the canonical JSON, preserve unrelated components, and add only what the requested change needs. Keep the existing design language unless asked to change it.
- **Reproduce existing HTML:** use the active HTML conversion workflow. Its rendered appearance, copy, assets, and measured geometry are the source of truth; do not redesign it.

## Generate and review

1. **Fast path (default):** inspect the brief, supplied assets and only the relevant part of the canonical page. Keep a compact section outline in working context (goal, audience/action, visual direction, content/composition); do not write a plan file. For each planned image slot, preserve its position and dimensions. Reuse a suitable user-supplied asset when appropriate; otherwise call the runtime's model-native image-generation capability to create a simple replacement-ready visual for up to three highest-priority slots. Do not search, browse, or retrieve candidate images by default. A brief that describes a real, licensed or source-verified final image still gets a generated placeholder unless the user explicitly asks to search for that asset; report that the final-image requirement remains unmet. If generation is unavailable or fails, keep that exact image area as an editable solid-color `rectangle` placeholder; never remove or collapse the image region. Report which slots need replacement.
2. **Expand only when needed:** consult one case when the user names a reference or a specific composition question needs it. Search for images only when the user explicitly asks to search, find, browse or verify sourced candidates. Follow `references/asset-workflow.md` for those explicit search requests; never use it to fill ordinary placeholder slots. Follow `references/generated-visuals.md` for default model-native placeholder generation. If the user prohibits AI imagery or placeholders, respect that and use sourcing only when requested; otherwise report the missing requirement without deleting its image area.
3. Let visitor questions determine content and length; avoid quotas and repeated claims. For complete new pages/full redesigns, design an editable masthead section named `Header` with brand, theme and useful action; use `brand-navbar` only for navigation. Honor explicit omission and do not add it during local edits.
4. Implement directly in compact IR using supported fields. Read only the relevant component-contract section or recipe when needed. Keep copy editable, make explicit visual cues visible, and keep `designProfile` concise and consistent with output. Generated copy remains English-only.
5. Existing canonical pages require an explicit mode: `patch` for focused edits (`update`, `delete`, `replace`, `replace-section`), `extend` for sections, and `replace` for full redesign. Omitted mode never implicitly appends.
6. Compile with `compiler/unico-ir-compiler.mjs`; fix errors and review relevant warnings. Inspect changed sections and dependencies; for full-page work also check first-screen hierarchy, section rhythm and primary action. Do not reread the full canonical page or run standalone validation after a successful compile when Gateway already validates. Use a rendered preview when available; report unverified effects and pending assets/facts.
7. Deliver the complete canonical `unico-page.json` envelope and compatibility `unico-export-result.json`. Preserve available `assetManifest` evidence and intentional `layoutHints`. The compiler writes atomically and validates; use `--validate-page` separately only for an unresolved issue or when Gateway validation is absent.

This default path removes optional research and repeated audits from routine runs. Use deeper references when the task needs them; preserve explicit requirements and factual accuracy.

In DND, preview with verified source URLs or signed Gateway generated-asset URLs. Generated previews expire after 24 hours by default; never leave those temporary links in the applied page. When the user clicks **Apply and end**, DND uploads newly introduced images/videos through its existing media backend, registers them under **Media Asset → AI Design**, and uses the stored URLs on the canvas. Do not upload during generation or ask the model for S3 credentials. Keep source-page/license evidence for sourced assets and real generation records for generated assets in `assetManifest`; after application, `directUrl` may be the user's storage URL and `originalUrl` identifies the original file. No image means no image-license check is needed.

The canonical page is a complete envelope, not a patch:

```json
{
  "designJson": [],
  "message": "Short summary"
}
```

## References

- [`references/asset-workflow.md`](references/asset-workflow.md) — optional bounded sourcing when real imagery is needed.
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
