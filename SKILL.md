---
name: unico-export
description: Design directly for Unico DND by producing compact Unico Design IR and compiling it into import-ready Unico page JSON.
---

# Unico Export

Use this plugin when the user wants Open Design to produce a Unico DND page directly.

Before making design decisions, read `references/design-guidelines.md` from this skill directory and follow its current prompt revision. That file is the tuning surface for design experiments and may change frequently; always use the staged copy from the active run instead of relying on remembered guidance.

Before writing IR, read `references/component-contract.md` and use only the documented IR fields for the components selected by the design. Prefer simple primitives, but use the extended visual components when they materially improve the requested page.

Do not create HTML first unless the user explicitly asks for an HTML prototype. The fast production path is:

1. Read `unico-page.json` when it exists. Treat its `designJson` array as the canonical current canvas.
2. Make the design decisions with AI: audience, hierarchy, copy, sections, color, spacing, visual rhythm, and conversion goals.
3. Preserve all existing page content unrelated to the request; do not replace the page with a fresh unrelated design.
4. Write a compact Unico Design IR file named `unico-design-ir.json`.
5. Run the local compiler shipped with this skill. In Open Design runs, the active skill is staged under `.od-skills/<unico-export...>/`; list `.od-skills` if you need the exact folder name.

```bash
node "$(find .od-skills -path '*/compiler/unico-ir-compiler.mjs' -print -quit)" unico-design-ir.json unico-export-result.json
```

6. Write the complete updated page envelope back to `unico-page.json`:

```json
{
  "designJson": [],
  "message": "short summary"
}
```

7. Return `unico-export-result.json` as a compatibility artifact. `unico-page.json` is the canonical page file for downstream consumers.

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
          "h": 120,
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

Use `rectangle` for cards, backgrounds, dividers, and panels. Use `img` only when you have a real image URL or project asset path. Use `rich-text` only for formatted lists or paragraphs. Do not use a specialized component merely because it exists; select it when its interaction or editable structure matches the brief.

Business components own their runtime data loading. Generate their legal default configuration, keep runtime collections such as `list`, `events`, `services`, and `blogContents` empty, and prefer automatic/all-data source modes. Do not invent business records. `brand-navbar` is promoted to the top level by the compiler.

## Layout Rules

- Default mobile canvas width is `386`.
- Top-level sections should be stacked vertically and use explicit heights.
- Keep child `x + w <= 386` unless intentional overflow is part of the design.
- Use `x: 20, w: 346` for common full-width content.
- Prefer a few clear sections over many tiny sections.
- Keep copy concise; Unico JSON is used for production editing.

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
    "errors": []
  }
}
```

The compiled `designJson` uses Unico-compatible field names such as:

- `bgColor`
- `radius`
- `justify`
- `component_list`
- wrapped `{ label, type, value }` controls

If the compiler output has validation errors, fix `unico-design-ir.json` and run the compiler again.
