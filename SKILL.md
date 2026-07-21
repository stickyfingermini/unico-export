---
name: unico-export
description: Design, validate, and export production-ready mobile pages for Unico DND through compact Unico Design IR and deterministic import-ready JSON compilation. Use when Open Design must create, extend, or fully redesign a Unico page while preserving canonical content, preventing layout errors, and using Unico visual or business components correctly.
---

# Unico Export

Use this plugin when the user wants Open Design to produce a Unico DND page directly.

Before making design decisions, read `references/design-guidelines.md` and `references/case-derived-layout-rules.md` from this skill directory. Follow the current prompt revision and the case-derived rules for component frequency, section composition, text spacing, image aspect ratios, and dedicated business sections. Always use the staged copies from the active run instead of relying on remembered guidance.

Before writing IR, read `references/component-contract.md` and use only the documented IR fields for the components selected by the design. If the page needs network images, also read `references/verified-image-sources.md`, search for theme-specific real images, and verify every final direct URL before export. Prefer simple primitives, but use the extended visual components when they materially improve the requested page.

Do not create HTML first unless the user explicitly asks for an HTML prototype. The fast production path is:

1. Read `unico-page.json` when it exists. Treat its `designJson` array as the canonical current canvas.
2. Make the design decisions with AI: audience, hierarchy, copy, sections, color, spacing, visual rhythm, and conversion goals.
3. Preserve all existing page content unrelated to the request. For edits, do not translate existing components into IR. Write IR only for new sections or intentionally replaced content.
4. Write `unico-design-ir.json` with `"mode": "extend"` for normal edits. Use `"mode": "replace"` only when the user explicitly requests a full redesign.
5. Before compiling, verify every section against this checklist:
   - Prefer `text`, `img`, `rectangle`, and `button`; use `rich-text` only for genuinely mixed formatting.
   - Keep button `paddingInline` and `paddingBlock` at `0` unless the user explicitly supplies different values. The compiler defaults both controls to `0` to prevent position drift.
   - Prefer omitting `h` for normal text so the compiler can estimate wrapped height. When a fixed height is necessary, size it conservatively, calculate the next `y` from the actual bottom, and keep overlapping text columns at least 8px apart.
   - Omit `h` for `rich-text` unless the brief requires a deliberately fixed frame. The compiler estimates it from weighted content width, inner padding, font size, line height, and a narrow-column safety allowance; explicit heights must not be smaller than that estimate.
   - Omit `h` from text-bearing `rectangle` cards. The compiler expands each card through the bottom of its contained foreground content plus `16px`; an explicit card height that clips content is rejected.
   - Match image frames to source aspect ratios and always set `fit` (`cover` or `contain`) deliberately. When source dimensions are known, include `sourceWidth` and `sourceHeight`; large `cover` crops also require an `objectPosition` focal point.
   - Search the web for every required image and use only a verified HTTP(S) raster-image URL that currently returns `HTTP 200` with an `image/*` content type. Never create or use SVG, inline SVG, data/blob URLs, local assets, placeholders, or Unsplash/Pexels/Pixabay detail pages.
   - Keep image/rectangle/circle backgrounds below text and actions with a lower `zIndex`. Use the button's own `text` instead of overlaying a separate text component.
   - Put each top-level/business component in an IR section with no other non-navbar child. The section is only an ordering carrier; the compiler removes it and emits the component directly beside `free-box` entries.
   - Use `allowOverflow` or `allowOverlap` only for an intentional, visually justified exception.
6. Run the local compiler shipped with this skill. In Open Design runs, the active skill is staged under `.od-skills/<unico-export...>/`; list `.od-skills` if you need the exact folder name.

```bash
node "$(find .od-skills -path '*/compiler/unico-ir-compiler.mjs' -print -quit)" unico-design-ir.json unico-export-result.json unico-page.json
```

7. Write the complete updated page envelope back to `unico-page.json`:

```json
{
  "designJson": [],
  "message": "short summary"
}
```

8. Return `unico-export-result.json` as a compatibility artifact. `unico-page.json` is the canonical page file for downstream consumers.

This keeps AI responsible for design judgment while deterministic code expands the verbose Unico schema.

## Unico Design IR

The IR is a compact JSON object:

```json
{
  "message": "short summary",
  "canvasWidth": 386,
  "sections": [
    {
      "id": "section-hero",
      "name": "Hero",
      "label": "Hero",
      "height": 680,
      "bgColor": "#21141f",
      "children": [
        {
          "type": "text",
          "id": "hero-title",
          "label": "Hero title",
          "text": "Main heading",
          "x": 20,
          "y": 80,
          "w": 346,
          "fontSize": 40,
          "lineHeight": 1.12,
          "fontWeight": 700,
          "color": "#fff4ef"
        },
        {
          "type": "button",
          "id": "hero-cta",
          "text": "Primary CTA",
          "x": 20,
          "y": 360,
          "w": 346,
          "h": 48,
          "bgColor": "#f08a8a",
          "color": "#1b1019",
          "radius": 10
        }
      ]
    }
  ]
}
```

## Supported IR Child Types

- `text`
- `button`
- `img`
- `img-text`
- `rectangle`
- `circle`
- `rich-text`
- `video-player`
- `countdown`
- `tabs`
- `accordion`
- `map`
- `rating`
- `social-share`
- `person-profile`
- `inquiry-box`
- `goods-list`
- `coupon`
- `navigation`
- `brand-navbar` (top-level only)
- `search`
- `banner`
- `store-information`
- `discount-promotion`
- `service-list`
- `event-list`
- `event-calendar`
- `blog-list`

Accepted aliases are normalized as follows: `product-list` => `goods-list`, `blog` => `blog-list`, `inquiry` => `inquiry-box`, and `storeinfo`/`store-info` => `store-information`.

Use `rectangle` for cards, backgrounds, dividers, and panels. For a card containing text or controls, omit `h` and let the compiler include the foreground content plus bottom padding; set `autoFitContent: false` only for a deliberate non-card decorative rectangle. Use `img` only after searching for a real, theme-specific HTTP(S) raster image and validating the final direct URL. Never generate SVG or use a local/generated image source. Use `rich-text` only for formatted lists or paragraphs. Do not use a specialized component merely because it exists; select it when its interaction or editable structure matches the brief.

Business components own their runtime data loading. Generate their legal default configuration, keep runtime collections such as `list`, `events`, `services`, and `blogContents` empty, and prefer automatic/all-data source modes. Do not invent business records. `brand-navbar` is promoted to the top level by the compiler.

When adding a top-level/business component, create one dedicated IR section containing only that component. This section preserves page order during authoring but is not emitted as a `free-box`; the compiled component is appended directly at the top level beside existing `free-box` entries.

Promote `goods-list`, `coupon`, `navigation`, `search`, `banner`, `store-information`, `discount-promotion`, `service-list`, `event-list`, `event-calendar`, `blog-list`, `map`, and `inquiry-box` to top-level output. Each must be the sole non-navbar child of its IR section. `brand-navbar` is also top-level and its carrier section is omitted.

In `extend` mode, the compiler preserves the current canonical `designJson` objects byte-for-structure and appends only newly compiled sections. This is the default editing workflow.

## Layout Rules

- Default mobile canvas width is `386`.
- Top-level sections should be stacked vertically and use explicit heights.
- Keep child `x + w <= 386` unless intentional overflow is part of the design.
- Use `x: 20, w: 346` for common full-width content.
- Prefer a few clear sections over many tiny sections.
- Keep copy concise; Unico JSON is used for production editing.
- Omit text `h` by default and let the compiler estimate wrapped height. Use an explicit height only when the composition requires it, and never set it below the estimated content height.
- For `rich-text`, default `paddingInline` and `paddingBlock` are `10`. The automatic height uses the inner width (`w - 2 × paddingInline`), weighted glyph widths, a minimum `1.5` line-height, vertical padding, and width-dependent safety space; it rounds upward and adds a final `1px` rasterization guard.
- Button `paddingInline` and `paddingBlock` default to `0`; do not add padding to compensate for positioning.
- Text-bearing rectangle cards default to automatic content fitting with `16px` bottom padding. Explicit card heights must contain every higher-layer component that starts inside the card.
- Keep same-column text boxes at least 8px apart and never overlap them by accident.
- Use `fit: "cover"` for photographic crops and `fit: "contain"` for logos or assets that must remain fully visible.

## Design Quality Rules

Apply the current rules in `references/design-guidelines.md`. Treat those rules as design direction and keep the IR/schema/compiler requirements in this file as hard technical constraints.

## Compiler Output

The compiler writes this envelope:

```json
{
  "type": "unico_design_result",
  "message": "short summary",
  "designJson": [],
  "validation": {
    "passed": true,
    "errors": [],
    "warnings": [],
    "metrics": {
      "textCount": 0,
      "imageCount": 0,
      "richTextCount": 0
    }
  }
}
```

The compiled `designJson` uses Unico-compatible field names such as:

- `bgColor`
- `radius`
- `justify`
- `component_list`
- wrapped `{ label, type, value }` controls

If the compiler output has validation errors, fix `unico-design-ir.json` and run the compiler again. Review warnings and composition metrics before delivery; they expose sparse imagery, excessive rich text, tight section endings, and risky crop decisions even when the JSON is structurally valid.
