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

Common visual update fields are `label`, `x`, `y`, `w`, `h`, `zIndex`, `fontSize`, `color`, `fontWeight`, `fontFamily`, `lineHeight`, `justify`, `bgColor`, `radius`, `borderColor`, `borderWidth`, `paddingInline`, `paddingBlock`, `letterSpacing`, `rotate`, `opacity`, `borderStyle`, and `customCSS`. Each field must already exist on the target component; text intentionally has no fixed height control. Content fields depend on type: for example `text` on text/button, `src` on image, and `html` or `content` on rich text.

Business component configuration is replaced as a complete compact-IR component instead of patched field by field. This keeps runtime data contracts deterministic.

## Routing

- Copy, color, typography, spacing, size, or position on known components: `update`.
- Remove known content: `delete`.
- Change a component's type or business configuration: `replace`.
- Recompose an existing section: `replace-section` and follow the full design guidance for that section.
- Add a new section: use `extend` rather than patch mode.

The compiler validates final geometry after the entire batch, including the actual parent of tab children. Operations may temporarily exceed a container if another operation makes the final result valid. If text may clip, or the component leaves its section bounds, adjust the affected component or replace the section. Do not fall back to a full-page redesign unless the user requested one.

## Images and replacement policy

Supply `assetManifest` evidence for new image URLs in replacements or `src`/`avatar` updates. Stored evidence is reused by URL, current evidence overrides the same URL, and unused entries are removed. Unchanged legacy images without evidence only warn. The canonical and compatibility envelopes both retain available evidence for the next edit.

Declare `explicitComponents` for explicitly requested replacement types such as `rating` or `tabs`; a normal update to an existing type needs no new declaration. All replacements follow generation rules, including deprecated types, nested-component restrictions, and complete-page single-use limits.

New or worsened bounds, text overlap, covering, clipping, or card-containment violations fail without updating the canonical page. Existing unchanged or improved layout issues warn. A geometry correction can resize the container and edit its content in one batch.

## Explicit edit modes and region replacement

An existing canonical requires an explicit mode, including when it is empty. Field edits use `mode: "patch"` and `op: "update"`; recomposition uses `op: "replace-section"` with the complete new section and child subtree. Omitted old children are removed; unrelated regions remain unchanged. New regions use `mode: "extend"`; complete redesigns use `mode: "replace"`. There is no implicit append on an existing page. A successful compile already checks the batch; Gateway validates the final envelope against the baseline. Use read-only `--validate-page` separately only for a concrete unresolved issue or when that runtime boundary is absent.
