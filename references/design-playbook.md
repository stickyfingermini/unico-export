# Design Playbook

Use for pages designed from a brief, not for faithful HTML conversion. The goal is a complete, art-directed page whose ideas can be found in its actual components and compiled JSON. Pair this playbook with `component-recipes.md`: compose from suitable reusable combinations, then adapt their geometry and styling to the brief.

## Select and inspect complete cases

Use [case-library.md](case-library.md) to choose a primary full-page study when it fits the brief. Read its analysis and open the actual screenshot; read a section map or selected source JSON only to answer a specific construction question. A filename or palette summary does not count as seeing the design. Keep those decisions in the single section plan below; do not write a second case record. Reuse inspected references during follow-up edits. An auxiliary case should solve a named need, not contribute an unrelated visual theme. All bundled images, remote URLs and brand facts are reference-only; original media cannot be reused. The active component contract takes precedence over historical case fields and fonts.

## 1. One content and composition plan

Record the page goal, audience, primary action, one art-direction sentence and selected reference relationships once. Use one compact table, in working context or existing supported designProfile fields; no extra plan file or approval stage is required:

| Section | Visitor question and confirmed content | Composition and explicit visual cues | Asset role, action and missing facts |
| --- | --- | --- | --- |
| Hero | What is this event, and who is it for? | Signboard display title above a wide photo strip | Warm table scene, wide crop; booking facts pending |
| Participation | How does joining work? | Indexed steps on a contrasting paper surface | Native rules/lines; CTA only with a valid destination |

Purpose, content, focal point, composition, transition and action are decisions covered by each row, not six separate documents. Keep cue/component evidence in this same plan when useful; do not produce a second cue map, ledger or storyboard. For a local edit, update only affected decisions.

Let distinct visitor questions determine section count and copy length. Include useful headings, short labels, explanations, steps and questions, without repeated claims or numerical content quotas. Never invent dates, prices, places, partners, testimonials, metrics, contact details or guarantees. Keep missing booking facts visible and unavailable targets unset. For a complete page, design a compact editable Header with identity, theme and useful action; use brand-navbar only for navigation, honor explicit omission and do not add a Header during local edits.

## 2. Make the direction visible

Translate each requested style cue into supported typography, image relationships, surfaces or composition. Use the selected case and relevant visual-recipes.md examples for concrete techniques, not an exhaustive style taxonomy. Every explicit cue needs visible implementation or a stated supported substitute; a matching palette is insufficient.

### A useful visual system

Decide how typography, color, layout, images, surfaces, and section transitions reinforce one another:

- **Typography:** assign display, body, and utility roles. Make their differences visible through family, weight, size, tracking, line height, case, and placement. Use split beats, rotated micro-labels, or offset duplicates selectively; do not turn all body copy into effects.
- **Color:** define background, surface, text, muted, and signal roles. Carry more than one accent when the requested style calls for it. Keep text contrast strong and match every explicit component color to `designProfile.theme`.
- **Composition:** vary alignment, scale, density, and image/text balance by section. Use asymmetric layouts, bleeds, rails, collages, or overlapping plates when the page story supports them. Do not arrange every section as the same rounded card.
- **Surface/motif:** choose two or three repeatable devices, such as an index stamp, grid, ticker, corner bracket, route line, tile, or caption plate. Use them to tie sections together without mechanically repeating every decoration.
- **Actions:** make the primary action easy to find and place it after enough context. Only add secondary actions when they serve a real task.

## 3. Source assets while composing

Follow [asset-workflow.md](asset-workflow.md) for roles, worker delegation, the helper, cache, budgets and fallback. Reuse suitable authentic brand/product/people materials. Determine image subject, ratio, crop/focal point and frame before placement; source candidates can arrive while the main agent composes with native placeholders. Preserve the intended relationships when a slot remains pending. Use contain for complete logos/artwork and intentional cover crops for photographs. Native components normally handle small geometric decoration.

## 4. Compose from the section plan

The first screen establishes identity/offer and a next step. Vary scale, alignment, image/text balance and section transitions where the information calls for it; avoid a long sequence of matching cards. Keep mobile text legible. The existing plan is the storyboard; do not repeat it as another deliverable.

## 5. Build the decisions in IR

Use supported types and fields from `component-contract.md`. The JSON itself—not `designProfile` prose—must carry the visual direction.

- Use `rectangle` for large color panels, card/backplate fills, patterned surfaces, tags, frames, and geometric ornaments. A patterned panel can use a short declaration-only `customCSS` gradient/repeating gradient when the target renderer supports it. When uncertain, make the motif with real rectangles and lines; never assume a CSS value works without preview evidence. Set decorative backgrounds behind content, use `autoFitContent: false`, and use the section-wide styling pattern in the component contract.
- Use `line` for thin rules, dividers, brackets, and directional strokes. `line.rotate` is the structured rotation control. Use `img.rotate` for a deliberately tilted image layer, keeping the crop and neighboring text legible.
- `text` has no structured rotate field. For a short utility label or stamp, `customCSS` may carry `transform: rotate(...)` and `transform-origin` if the Unico renderer applies declarations to text. Treat it as unverified until the compiled page is previewed; if it fails, use a rotated line/image or a stepped, unrotated label as a visible substitute. Avoid rotating long copy, buttons, or essential reading text.
- For layered display type, create separate short `text` components with careful offsets, distinct theme colors, small z-index differences, and `allowOverlap: true` only for the intended text-on-text art effect. Never layer long paragraphs.
- Use geometry and pattern intentionally: choose a few purposeful shape types/sizes, place them as framing or directional signals, and keep them from colliding with copy or actions. Decoration should support the design, not fill empty areas indiscriminately.
- Use descriptive stable IDs. In `designProfile`, record the chosen direction honestly and concisely; do not write research claims or rejected directions that were not actually performed.

Recompute positions and section heights for the content. Do not copy case coordinates. Keep each color referenced by a component in the theme. Permit overflow only for a deliberate, reviewable bleed. Maintain the compiler's content, text spacing, image, and overlap rules.

## 6. Inspect the compiled result against the brief

For a case-guided page, compare the actual output with the single section plan: did the distinctive hierarchy, image roles and change of section rhythm survive, and does every content module answer a new visitor question? Do not reward the source's raw section/photo count or reuse its testimonials and business claims. For a placeholder draft, review the reserved image roles and list missing assets/facts rather than treating placeholder rectangles as completed imagery.

Inspect the changed regions and their dependencies against the plan. For full-page work, inspect overall first-screen hierarchy, section rhythm and action path. Let compiler/Gateway checks handle field and geometry constraints; do not routinely recount text runs or reread a large canonical file after each local edit. Inspect relevant output components when a warning, lost cue or suspected compilation issue calls for it.

Use a rendered preview when available and authorized for crop, typography, overlap, layering and clipping, especially customCSS or rotation. Report unverified effects honestly. Correct IR rather than patching generated JSON. One successful compile plus Gateway validation is the normal path; extra standalone validation is for a concrete unresolved issue or a runtime without that boundary check. A schema pass is not a design pass.

## Minimal direction record

The compiler requires legacy profile keys. Keep them factual and concise; this example records a visual decision but does not replace its component implementation.

```json
{
  "designProfile": {
    "source": "unico-export",
    "query": "Mahjong social club page",
    "direction": "Tropical print-shop energy with a social photo collage",
    "variationSeed": "sosyal-print-01",
    "axes": {
      "layout": "image-led poster followed by varied editorial sections",
      "palette": "deep green, lime, warm cream, and magenta signal",
      "typography": "heavy display sans with compact utility labels",
      "imageRhythm": "hero photograph followed by distinct supporting images"
    },
    "designResearch": {
      "tool": "unico-export-local-planning",
      "designSystemQuery": "Social Mahjong events for a playful community audience",
      "uxQuery": "Identify the club, explain participation, and keep the next action clear",
      "styleReferences": ["Tropical Kitsch Futurism"]
    },
    "theme": {
      "primary": "#073B28",
      "secondary": "#1ED760",
      "accent": "#EBFF3C",
      "background": "#073B28",
      "surface": "#FFF6D7",
      "text": "#18151A",
      "muted": "#587063",
      "onPrimary": "#FFF6D7",
      "onSurface": "#18151A",
      "border": "#F41AD5",
      "signal": "#F41AD5",
      "warmAccent": "#FF7A26"
    }
  }
}
```

## Active composition default

Use the complete studies selected through case-library.md and relevant construction moves in visual-recipes.md to guide relationships rather than copying pages. Let content choose image scale and position, negative space, offset plates, asymmetry, overlap and section rhythm. Combine compatible advanced recipes; no image or decoration quota applies. Keep important information editable and legible, with intentional overflow flags only for deliberate bleed.
