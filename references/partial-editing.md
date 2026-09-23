# Deterministic Partial Editing

Use this mode for focused changes to an existing `unico-page.json`. It avoids rebuilding or restating unrelated sections.

## Input

Write `unico-design-ir.json` with `mode: "patch"`, a short message, and one or more operations:

```json
{
  "mode": "patch",
  "message": "Updated the hero call to action.",
  "operations": [
    {
      "op": "update",
      "id": "hero-cta",
      "changes": {
        "text": "Book a consultation",
        "bgColor": "#2563eb"
      }
    }
  ]
}
```

Every target ID must match exactly one canonical component. A missing or duplicate target fails without changing `unico-page.json`.

## Operations

- `update`: supply `changes`. The compiler accepts only semantic fields supported by that component.
- `delete`: removes the target and its nested content.
- `replace`: for a nested component, supply a complete compact-IR `component`. For a top-level section, supply a complete compact-IR `section`.
- `replace-section`: explicit alias for replacing a top-level section with `section`.

Replacement keeps the target ID when the supplied `component` or `section` omits its own ID.

Common visual update fields are `label`, `x`, `y`, `w`, `h`, `zIndex`, `fontSize`, `color`, `fontWeight`, `fontFamily`, `lineHeight`, `justify`, `bgColor`, `radius`, `borderColor`, `borderWidth`, `paddingInline`, `paddingBlock`, and `letterSpacing`. Content fields depend on type: for example `text` on text/button, `src` on image, and `html` or `content` on rich text.

Business component configuration is replaced as a complete compact-IR component instead of patched field by field. This keeps runtime data contracts deterministic.

## Routing

- Copy, color, typography, spacing, size, or position on known components: `update`.
- Remove known content: `delete`.
- Change a component's type or business configuration: `replace`.
- Recompose an existing section: `replace-section` and follow the full design guidance for that section.
- Add a new section: use `extend` rather than patch mode.

The compiler validates geometry after layout-sensitive updates. If text may clip, or the component leaves its section bounds, adjust the affected component or replace the section. Do not fall back to a full-page redesign unless the user requested one.
