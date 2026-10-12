# Unico Design Guidelines

## Prompt Revision

`case-authorship-v6`

Change this revision label whenever an experiment materially changes the design direction. Include the active revision in the IR `message` so generated outputs can be compared later.

## Design Objective

Create a deliberate, production-oriented mobile page rather than a generic component demo. Translate the user's brief into a clear visual concept, content hierarchy, section rhythm, and conversion path before writing the IR.

For new pages and full redesigns, apply the bundled semantic-theme and controlled-variation guidance in `design-optimization.md`. Record the theme and chosen direction in IR `designProfile`.

## Current Tuning Profile

- Visual density: balanced
- Visual contrast: strong but controlled
- Section count: usually 5 to 8; narrative portfolio, timeline, or video pages may use 8 to 11
- Corner treatment: mixed; do not round every container
- Card usage: only when grouping genuinely benefits comprehension
- Imagery: use real focal images and supporting images when the content calls for them; vary frames according to source aspect ratio
- Typography: expressive display hierarchy with highly readable body copy
- Copy: concise, specific, and English-only
- CTA strategy: one clear primary action, with secondary actions only when useful
- Color system: one page-level semantic theme reused by every section and component
- Variation: choose a page-specific fingerprint across layout, palette, typography, image rhythm, surface treatment, CTA treatment, and section transition; consult `design-style-library.md`
- Visual authorship: compose a purposeful mobile Header and actively consider generated raster support when user assets do not cover important visual roles

These values are the main experiment controls. Edit them first when comparing outputs.

## Composition Rules

- Make the first screen communicate the brand, offer, event, or purpose immediately.
- For a new page or full redesign, deliberately design a Header with a recognizable brand treatment, only useful mobile navigation/utility, and an action when it serves the page goal. Set its alignment, height, and relation to the Hero before placing child elements.
- Establish one dominant focal point per section.
- Vary section composition and background treatment to create rhythm; avoid stacking visually identical white cards.
- Adapt at least two concrete layout or image-rhythm techniques from at least two of the supplied production cases when the brief allows. See `case-study-excerpts.md`; record the adaptation rather than merely naming inspiration.
- Use meaningful scale contrast, offset alignment, broken grids, staggered image crops, planned edge bleeds, image/color-plane overlaps, or mixed section densities when they serve the content. Do not default to equal-sized images and repeated cards; don't use arbitrary overflow as a substitute for composition.
- Select one brief-specific visual direction before writing IR. Compare alternatives only when the brief is genuinely ambiguous.
- Vary at least three design axes from the previous known result for repeated or similar briefs.
- Keep all explicit section and component colors inside the page-level `designProfile.theme` token set.
- Use spacing intentionally. Prefer a few confident groups over many small disconnected elements.
- Keep primary content inside the 386px canvas and respect safe side margins.
- Use rectangles, color fields, dividers, typography, and imagery to create depth without relying on unsupported effects.
- Keep same-column text components at least 8px apart after accounting for their rendered height. Use 12–20px between a title and body copy when space permits.
- Place section titles near the top (usually 16–40px) and preserve 24–48px after the final content group.
- Give fixed business components a dedicated section with no decorative or text siblings.

## Visual Quality Rules

- Choose colors, typography, spacing, hierarchy, and CTA placement as one coherent system.
- Prefer a recognizable visual direction that fits the brief instead of defaulting to generic SaaS styling.
- Avoid unnecessary purple gradients, excessive glow, emoji decoration, pill-shaped everything, and repetitive floating cards unless the user requests that style.
- Do not invent awards, testimonials, statistics, prices, dates, or business claims. Use honest placeholders when information is missing.
- Complete an asset pass before layout is locked. Map useful roles (background, focal image, supporting photography, icon, illustration, texture, ornament) to supplied assets, generated custom concepts, or verified sources. Proactively generate page-specific raster concepts early when they fit better than generic stock material. Generated local files can guide art direction, but final IR still requires a verified HTTP(S) raster URL with explicit commercial-use evidence in `assetManifest`; never describe staged files as publish-ready. Never create SVG imagery or use local, data, blob, placeholder, unknown-license, editorial-only, non-commercial, or detail-page sources in final IR.
- Match frame shape to source shape. Use `cover` for photographic crops, `contain` for logos/icons, and avoid `fill` unless stretching a purpose-built decorative strip.
- Do not reproduce DOM structure mechanically. Build the intended editable Unico page structure.

## Content and Conversion Rules

- Write all generated page copy in English.
- Write concrete headings and CTA labels rather than generic filler such as “Welcome” or “Learn More” when a more specific action is possible.
- Keep body copy short enough for a mobile composition.
- Ensure the section order tells a coherent story and leads naturally toward the primary action.

## Experiment Notes

Use this section for temporary prompt experiments. Remove obsolete instructions instead of accumulating contradictory rules.

- Active revision combines patterns measured from the supplied Unico cases with bundled design guidance and controlled visual variation. See `case-derived-layout-rules.md`, `case-study-excerpts.md`, and `design-optimization.md`.
