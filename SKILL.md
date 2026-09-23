---
name: unico-export
description: Create, extend, or deterministically edit production-ready Unico DND mobile pages through compact IR and validated import-ready JSON. Use for page design requests in a Unico workspace; ordinary conversation does not modify the page.
---

# Unico Export

Use this skill when the user wants to design or change the Unico DND page in the current workspace. `unico-page.json` is the canonical canvas.

Choose the smallest workflow that satisfies the request:

- Ordinary conversation: answer normally. Do not read or rewrite the page and do not run the compiler.
- Focused edit to known existing components: read `references/partial-editing.md` and use `mode: "patch"`. Reuse the current design direction and skip unrelated design work.
- Add new content: read `references/component-contract.md` and the relevant parts of `references/design-guidelines.md`, then use `mode: "extend"` with only the new sections.
- Recompose one existing section: read `references/partial-editing.md`, `references/component-contract.md`, and the relevant local design references, then use `replace-section` for that section only.
- New page or explicit full redesign: read `references/component-contract.md`, `references/design-guidelines.md`, `references/design-optimization.md`, and `references/case-derived-layout-rules.md`, then use `mode: "replace"`.

If the page needs new network images, also read `references/verified-image-sources.md`, search for theme-specific real images, verify the source license and each final direct URL, and record evidence in the IR `assetManifest`. Treat component selection as a policy, not a menu: build primarily with `text`, `img`, `button`, `rectangle`, and compiler-generated `free-box` containers.

Use English exclusively in every generated string, including page copy, labels, messages, component content, documentation, and examples. Never emit Chinese or other CJK text. The compiler rejects CJK strings in IR.

Do not create HTML first unless the user explicitly asks for an HTML prototype. The fast production path is:

1. Read `unico-page.json` when the selected workflow needs page state. Treat its `designJson` array as the canonical current canvas.
2. Make only the design decisions needed for the request. For a new page or full redesign, use the bundled local rules in `references/design-optimization.md` and `references/design-style-library.md`; no external design Skill is required.
3. Preserve all existing page content unrelated to the request. Do not translate preserved components back through IR.
4. Write the smallest `unico-design-ir.json`: `patch` for focused edits, `extend` for additions, and `replace` only for an explicitly requested full redesign.
5. For new or recomposed visual content, verify every section against this checklist:
   
   - Use `text`, `img`, `button`, and `rectangle` frequently. Sections compile to `free-box` containers. Use `rich-text` only when mixed formatting is necessary.
   - Use each of `banner`, `blog-list`, `service-list`, `event-list`, `event-calendar`, `store-information`, `inquiry-box`, `goods-list`, and `map` only when the page context warrants it and never more than once.
   - Never use deprecated `img-text` or `circle`.
   - Use every other registered component only when the user explicitly requests it, and list its canonical type in top-level `explicitComponents`.
   - Keep button `paddingInline` and `paddingBlock` at `0` unless the user explicitly supplies different values. The compiler defaults both controls to `0` to prevent position drift.
   - Prefer omitting `h` for normal text so the compiler can estimate wrapped height. When a fixed height is necessary, size it conservatively, calculate the next `y` from the actual bottom, and keep overlapping text columns at least 8px apart.
   - Omit `h` for `rich-text` unless the brief requires a deliberately fixed frame. The compiler estimates it from weighted content width, inner padding, font size, line height, a narrow-column safety allowance, and a mandatory additional `20px` clipping buffer; explicit heights must not be smaller than that estimate.
   - Omit `h` from text-bearing `rectangle` cards. The compiler expands each card through the bottom of its contained foreground content plus `16px`; an explicit card height that clips content is rejected.
   - Match image frames to source aspect ratios and always set `fit` (`cover` or `contain`) and `scale` deliberately. For `cover`, calculate the minimum scale from the source/frame aspect-ratio difference, round upward to two decimals, and use `1.20` when source dimensions are unknown. When source dimensions are known, include `sourceWidth` and `sourceHeight`; large `cover` crops also require a `cropArea` focal point.
   - Search the web for every required image and use only a verified HTTP(S) raster-image URL that currently returns `HTTP 200` with an `image/*` content type and has explicit, source-page evidence of commercial use permission. Record `directUrl`, `sourcePage`, `author`, `license`, `commercialUse`, `attributionRequired`, `attribution` when needed, `verifiedAt`, `contentType`, and `statusCode` in top-level `assetManifest`. Never create or use SVG, inline SVG, data/blob URLs, local assets, placeholders, images with unknown/editorial/non-commercial licenses, or Unsplash/Pexels/Pixabay detail pages.
   - Keep image and rectangle backgrounds below text and actions with a lower `zIndex`. Use the button's own `text` instead of overlaying a separate text component.
   - Put each top-level/business component in an IR section with no other non-navbar child. The section is only an ordering carrier; the compiler removes it and emits the component directly beside `free-box` entries.
   - Use `allowOverflow` or `allowOverlap` only for an intentional, visually justified exception.
   - Do not set a width on `inquiry-box`; keep it as the only child of its carrier section so the runtime can fill the available width naturally.
   - Define one page-level semantic color theme in `designProfile.theme` and reuse its tokens across every section, primitive, CTA, and business component. Create visual variety through layout, type, imagery, surfaces, and spacing—not unrelated section colors.
6. Run the local compiler shipped with this skill. In the Codex Gateway it is at `$CODEX_HOME/skills/unico-export/compiler/unico-ir-compiler.mjs`. Open Design may stage it under `.od-skills/<unico-export...>/`.

```bash
node "$CODEX_HOME/skills/unico-export/compiler/unico-ir-compiler.mjs" unico-design-ir.json unico-export-result.json unico-page.json
```

7. Use the compiler exit code and compact stdout summary. Inspect the result file only to diagnose failure. Fix the IR rather than patching compiled JSON manually.
8. Do not rewrite `unico-page.json` after successful compilation. The compiler writes the complete validated envelope:

```json
{
  "designJson": [],
  "message": "short summary"
}
```

9. Return a concise natural-language summary without pasting page JSON. `unico-export-result.json` remains a compatibility artifact.

This keeps AI responsible for design judgment while deterministic code expands the verbose Unico schema.

## Unico Design IR

The IR is a compact JSON object:

```json
{
  "message": "short summary",
  "canvasWidth": 386,
  "explicitComponents": [],
  "designProfile": {
    "source": "unico-export-bundled-rules",
    "query": "community events warm editorial image-led mobile landing page",
    "direction": "Warm editorial community journal",
    "variationSeed": "community-journal-07",
    "designResearch": {
      "tool": "unico-export-bundled-rules",
      "designSystemQuery": "community events warm editorial image-led mobile landing page",
      "uxQuery": "visual hierarchy accessibility spacing consistency mobile ux",
      "styleReferences": ["Editorial Magazine", "Swiss / International Typographic"]
    },
    "theme": {
      "primary": "#f08a8a",
      "secondary": "#21141f",
      "accent": "#f08a8a",
      "background": "#1b1019",
      "surface": "#21141f",
      "text": "#fff4ef",
      "muted": "#fff4ef",
      "onPrimary": "#1b1019",
      "onSurface": "#fff4ef",
      "border": "#f08a8a"
    },
    "axes": {
      "layout": "asymmetric editorial stack",
      "palette": "warm paper, ink, and coral",
      "typography": "expressive display with restrained sans body",
      "imageRhythm": "one full-bleed hero followed by alternating portrait and landscape crops"
    }
  },
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

## Component Usage Policy

Apply these tiers before selecting any component:

- Frequent foundation: use `text`, `img`, `button`, and `rectangle` heavily. Every multi-child IR section compiles to a `free-box`, which is the primary layout container.
- Moderate: use `rich-text` only for mixed inline formatting, formatted lists, or content that cannot be represented cleanly by separate text components.
- Conditional single-use: use `banner`, `blog-list`, `service-list`, `event-list`, `event-calendar`, `store-information`, `inquiry-box`, `goods-list`, and `map` only when the page context warrants the behavior. Each type may appear at most once in the complete page.
- Deprecated: never use `img-text` or `circle`. The compiler rejects both.
- Explicit-only: use `video-player`, `countdown`, `tabs`, `accordion`, `rating`, `social-share`, `person-profile`, `coupon`, `navigation`, `brand-navbar`, `search`, and `discount-promotion` only when the user explicitly requests that capability. Add each selected canonical type to top-level `explicitComponents`.
- Unsupported: do not use any other component type unless the registry and this contract are deliberately updated first.

Accepted aliases are normalized as follows: `product-list` => `goods-list`, `blog` => `blog-list`, `inquiry` => `inquiry-box`, and `storeinfo`/`store-info` => `store-information`.

`explicitComponents` is an audit declaration, not a general allowlist. Do not populate it speculatively. It must reflect capabilities named by the user.

Use `rectangle` for cards, backgrounds, dividers, and panels. For a card containing text or controls, omit `h` and let the compiler include the foreground content plus bottom padding; set `autoFitContent: false` only for a deliberate non-card decorative rectangle. Use `img` only after searching for a real, theme-specific HTTP(S) raster image, validating its commercial-use license and final direct URL, and recording the evidence in `assetManifest`. Encode image crop, zoom, rotation, radius, and translation through the structured image fields; use `customCSS` only for additional declarations. Never generate SVG or use a local/generated image source. Do not use a specialized component merely because it exists.

Business components own their runtime data loading. Generate their legal default configuration, keep runtime collections such as `list`, `events`, `services`, and `blogContents` empty, and prefer automatic/all-data source modes. Do not invent business records. `brand-navbar` is promoted to the top level by the compiler.

When adding a top-level/business component, create one dedicated IR section containing only that component. This section preserves page order during authoring but is not emitted as a `free-box`; the compiled component is appended directly at the top level beside existing `free-box` entries.

Promote `goods-list`, `coupon`, `navigation`, `search`, `banner`, `store-information`, `discount-promotion`, `service-list`, `event-list`, `event-calendar`, `blog-list`, `map`, and `inquiry-box` to top-level output. Each must be the sole non-navbar child of its IR section. `brand-navbar` is also top-level and its carrier section is omitted.

In `extend` mode, the compiler preserves the current canonical `designJson` objects byte-for-structure and appends only newly compiled sections. Focused edits use `patch`; read `references/partial-editing.md` for the operation contract.

## Layout Rules

- Default mobile canvas width is `386`.
- Top-level sections should be stacked vertically and use explicit heights.
- Keep child `x + w <= 386` unless intentional overflow is part of the design.
- Use `x: 20, w: 346` for common full-width content.
- Prefer a few clear sections over many tiny sections.
- Keep copy concise; Unico JSON is used for production editing.
- Omit text `h` by default and let the compiler estimate wrapped height. Use an explicit height only when the composition requires it, and never set it below the estimated content height.
- For `rich-text`, default `paddingInline` and `paddingBlock` are `10`. The automatic height uses the inner width (`w - 2 × paddingInline`), weighted glyph widths, a minimum `1.5` line-height, vertical padding, width-dependent safety space, and an additional `20px` clipping buffer; it rounds upward and adds a final `1px` rasterization guard.
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

The compiler performs a final type-specific output audit after compilation and after canonical extension. It checks:

- every root `id`, `label`, and canonical `type`;
- the complete `free-box` structure, styles, config, and wrapped controls;
- required structure and style controls for every field-based component;
- complete text/image/button/shape link values;
- every fixed business component name and required property path;
- nested tab container contracts and all nested child components;
- duplicate IDs, deprecated types, business-component top-level placement, and conditional single-use limits.

The compiler does not write `unico-page.json` when this audit fails. Preserved canonical components are checked too, so an incomplete existing component must be repaired at its source rather than silently carried into a new export.
