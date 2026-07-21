# unico-export

`unico-export` is the Open Design plugin for generating and updating pages for the Unico DND canvas.

## Workflow

1. Read `unico-page.json` from the active project when it exists.
2. Treat its `designJson` array as the current canvas.
3. Apply the user's request while preserving unrelated sections and component properties. Existing components are not round-tripped through IR.
4. Compile the updated design with `compiler/unico-ir-compiler.mjs`.
5. Write the complete result back to `unico-page.json`.
6. Also write `unico-export-result.json` for older integrations.

For normal edits, set `mode: "extend"` in `unico-design-ir.json` and include only new sections. The compiler reads the existing canonical page, keeps all current component objects unchanged, appends the new compiled sections, and writes the complete result back. Use `mode: "replace"` only for an explicitly requested full redesign.

The canonical file is a complete envelope, not a patch:

```json
{
  "designJson": [
    "...complete Unico component array..."
  ],
  "message": "summary of the update"
}
```

If `unico-page.json` does not exist, create it from the newly generated page. The compiler always writes `unico-export-result.json` so validation errors are inspectable, but writes or updates `unico-page.json` only after validation passes. A malformed existing canonical page is never silently replaced.

Validation covers JSON/envelope structure, stable unique IDs, 386px bounds, section height, text sizing and overlap, background layering, intentional image fitting and crop focus, non-empty media, fixed-component isolation, and supported component types. The result also reports composition metrics and non-blocking quality warnings.

文本组件按固定 Unico 契约输出且不包含 `height` 样式控制。富文本省略高度时，会根据内容、内边距、字号和可用宽度保守估算。网络图片必须使用经验证的 CDN 直链；图片站详情页 URL 会被编译器拒绝。可用后备素材及验证流程见 [`references/verified-image-sources.md`](references/verified-image-sources.md)。

按钮的水平和垂直内边距默认均为 `0`。矩形卡片省略高度时会自动包含内部前景内容，显式高度不足会报错。所有新图片必须来自在线搜索并使用经验证的 HTTP(S) 位图直链；SVG、本地文件、data/blob 和生成式图片源全部禁止。

Event List、Service List、Product List、Blog、Coupon、Inquiry、Map、Store Information 等业务组件在 IR 中各自独占一个排序区块；编译时区块外壳会被移除，组件直接与其他 `free-box` 同级输出。

## References

- [`SKILL.md`](SKILL.md) — execution workflow and compiler contract
- [`references/component-contract.md`](references/component-contract.md) — supported component fields
- [`references/design-guidelines.md`](references/design-guidelines.md) — current visual design guidance

## Compatibility

`unico-export-result.json` remains available for older DND clients, but `unico-page.json` is authoritative whenever both files exist.

## Component coverage

The compiler supports every component currently registered by the DND AI import validator, including navigation, banner, search, store information, product, promotion, coupon, service, event, calendar, and blog components. Business components keep runtime data collections empty so the component can fetch current store data through its built-in API behavior.
