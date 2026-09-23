---
name: unico-export
description: Create, extend, or deterministically edit Unico DND pages through compact IR and validated import-ready JSON. Use for page design requests in a Unico workspace; ordinary conversation does not modify the page.
---

# Unico Export

Use this skill when the user wants to design or change the Unico DND page in the current workspace. `unico-page.json` is the canonical canvas.

First choose the smallest workflow that satisfies the request:

- Ordinary conversation: answer normally. Do not read or rewrite the page and do not run the compiler.
- Focused edit to known existing components: read `references/partial-editing.md` and use `mode: "patch"`. Reuse the current design direction and skip design research unrelated to the requested fields.
- Add new content: read `references/component-contract.md` and the relevant parts of `references/design-guidelines.md`, then use `mode: "extend"` with only the new sections.
- Recompose one existing section: read all three references, then use `replace-section` for that section only.
- New page or explicit full redesign: read `references/component-contract.md` and `references/design-guidelines.md`, then use `mode: "replace"`.

Only search for media when the requested change introduces or replaces media. Preserve every unrelated canonical object, ID, property, and section order.

## Execution

Do not create HTML first unless the user explicitly asks for an HTML prototype.

1. Read `unico-page.json` when it exists. Treat its `designJson` array as the canonical current canvas.
2. Write the smallest `unico-design-ir.json` for the selected workflow.
3. Run the compiler from the active Skill directory. In the Codex Gateway it is located at `$CODEX_HOME/skills/unico-export/compiler/unico-ir-compiler.mjs`. Open Design may stage it under `.od-skills/<unico-export...>/compiler/`.

```bash
node "$CODEX_HOME/skills/unico-export/compiler/unico-ir-compiler.mjs" unico-design-ir.json unico-export-result.json unico-page.json
```

4. Use the compiler exit code and compact stdout summary. Inspect the result file only to diagnose a reported failure; it contains the full compatibility payload.
5. Do not rewrite `unico-page.json` after successful compilation. The compiler writes the complete validated envelope only after all operations succeed:

```json
{
  "designJson": [],
  "message": "short summary"
}
```

6. Return a concise natural-language description. Do not paste page JSON into chat.

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

When adding `coupon`, `goods-list`, `discount-promotion`, `service-list`, `event-list`, `event-calendar`, `blog-list`, `banner`, or `store-information` to an existing page, create a new dedicated section for each major component unless the user explicitly identifies a safe target section. Do not insert these components into an existing free-form section without shifting later components and expanding the section height.

In `extend` mode, the compiler preserves the current canonical `designJson` objects byte-for-structure and appends only newly compiled sections. Focused edits use `patch`, while `replace` is reserved for an explicit full redesign.

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

If the compiler reports validation errors, fix the compact IR and run it again. Failed compilation never overwrites the canonical page.
