# unico-export

`unico-export` is the Open Design plugin for generating and updating pages for the Unico DND canvas.

## Workflow

1. Read `unico-page.json` from the active project when it exists.
2. Treat its `designJson` array as the current canvas.
3. Apply the user's request while preserving unrelated sections and component properties.
4. Compile the updated design with `compiler/unico-ir-compiler.mjs`.
5. Write the complete result back to `unico-page.json`.
6. Also write `unico-export-result.json` for older integrations.

The canonical file is a complete envelope, not a patch:

```json
{
  "designJson": [
    "...complete Unico component array..."
  ],
  "message": "summary of the update"
}
```

If `unico-page.json` does not exist, create it from the newly generated page. If compilation reports validation errors, fix the IR before writing either output.

## References

- [`SKILL.md`](SKILL.md) — execution workflow and compiler contract
- [`references/component-contract.md`](references/component-contract.md) — supported component fields
- [`references/design-guidelines.md`](references/design-guidelines.md) — current visual design guidance

## Compatibility

`unico-export-result.json` remains available for older DND clients, but `unico-page.json` is authoritative whenever both files exist.

## Component coverage

The compiler supports every component currently registered by the DND AI import validator, including navigation, banner, search, store information, product, promotion, coupon, service, event, calendar, and blog components. Business components keep runtime data collections empty so the component can fetch current store data through its built-in API behavior.
