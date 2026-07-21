# Unico Visual Component IR Contract

Read this file before writing `unico-design-ir.json`. Generated components are declared as section children. Free-positioned visual components use `x`, `y`, `w`, `h`, and optional `zIndex`. Top-level/business components must occupy a one-child IR section; the compiler removes that carrier and emits the component directly beside `free-box` entries.

## Contents

- Core types
- Extended visual types
  - img-text
  - video-player
  - countdown
  - tabs
  - accordion
  - map
  - rating
  - social-share
  - person-profile
  - inquiry-box
  - goods-list
  - coupon
  - navigation
  - brand-navbar
  - search
  - banner
  - store-information
  - discount-promotion
  - service-list
  - event-list
  - event-calendar
  - blog-list
- Constraints

## Core Types

The existing core types remain supported:

- `text`: `text`, typography, padding, color and link fields；编译结果固定使用 `label: "Text"`、`Text Content` 和 `Text Style`，并省略 `height` 样式字段
- `img`: `src`, radius and link fields
- `button`: `text`, colors, radius, padding and link fields
- `rectangle` / `circle`: background, border and link fields
- `rich-text`: `html`/`content`/`text`、`paddingInline`、`paddingBlock` 和排版字段；省略 `h` 时自动估算高度

### 文本组件输出不变量

`text` 的输出结构不是通用组件结构。编译器必须固定输出 `label: "Text"`、`field.structure.label: "Text Content"`、`field.styles.label: "Text Style"`，无链接时 `link.value.type` 为 `external`。样式字段及顺序固定为：

```text
width, paddingInline, paddingBlock, fontSize, fontFamily, color,
fontWeight, letterSpacing, lineHeight, fontStyle, textDecoration,
justify, zIndex, top, left
```

默认值为 `paddingInline: 20`、`paddingBlock: 10`、`letterSpacing: 0`、`fontStyle: "normal"`、`textDecoration: "none"`。不得输出 `height`，`fontWeight` 的标签必须为 `Font Weight`，`justify` 的标签必须为 `Layout`。

### 按钮组件输出不变量

`button` 的 `paddingInline`（Horizontal Padding）和 `paddingBlock`（Vertical Padding）默认值都必须为 `0`。只有用户明确要求时才允许非零值，禁止用 padding 修正按钮坐标或尺寸。

### 矩形卡片高度

包含文本、按钮或其他前景组件的 `rectangle` 应省略 `h`。编译器会查找矩形范围内且 `zIndex` 更高的内容，将卡片高度扩展到内容底部再增加默认 `16px` 的 `contentPaddingBottom`。同列的下一个矩形会结束当前卡片的自动内容范围。

显式 `h` 不会被静默覆盖；如果一个前景组件从卡片内部开始但实际底部超过卡片，编译器会拒绝输出。只有纯装饰矩形才使用 `autoFitContent: false`。

### Common positioning and safety fields

```json
{
  "x": 20,
  "y": 40,
  "w": 346,
  "h": 80,
  "zIndex": 5,
  "allowOverflow": false,
  "allowOverlap": false,
  "allowTightSpacing": false
}
```

- Omit `h` for normal `text`. The compiler uses a conservative wrapped-height estimate for validation, but the generated text style intentionally contains no `height` control so the runtime can size it naturally.
- Omit `h` for `rich-text` by default. Its estimated height is `ceil(行数 × 字号 × 有效行高 + 2 × paddingBlock + 安全量) + 1px`；行数基于 `w - 2 × paddingInline` 和中英文加权字宽计算，有效行高最小为 `1.5`。窄栏会增加标点换行与裁切安全量，最后的 `1px` 用于覆盖浏览器栅格化误差。
- Set `allowOverflow: true` only for an intentional image/rectangle bleed outside the section or 386px canvas.
- Set `allowOverlap: true` only for intentional text-on-text art direction. Image/rectangle backgrounds may overlap text without this flag.
- Set `allowTightSpacing: true` only when same-column text needs less than the default 8px gap without intersecting.

### Image fields

```json
{
  "type": "img",
  "src": "https://images.unsplash.com/photo-1767169768227-79688439fb37?auto=format&fit=crop&w=1200&q=80",
  "x": 20,
  "y": 80,
  "w": 346,
  "h": 240,
  "fit": "cover",
  "objectPosition": "50% 35%",
  "sourceWidth": 1600,
  "sourceHeight": 1200,
  "radius": 12
}
```

- `fit` is required and accepts `cover`, `contain`, or `fill`; prefer `cover` for photos and `contain` for logos/icons.
- `objectPosition` uses CSS object-position syntax and defaults to `50% 50%`.
- `sourceWidth` and `sourceHeight` are optional validation hints. Provide both when the original dimensions are known.
- When a `cover` frame differs from the supplied source ratio by more than 1.5×, explicitly set `objectPosition` to protect the focal point. `fill` is rejected when supplied dimensions prove that it would distort the source.
- `src` must be a verified HTTP(S) raster-image direct URL. Local paths, empty sources, data/blob URLs, placeholders, generated sources, and known provider detail-page URLs are compilation errors.
- 禁止任何 SVG 来源，包括 `.svg`/`.svgz` 路径、返回 SVG 的查询参数、`data:image/svg+xml` 和内联 `<svg>`。不得自行生成 SVG 图片。
- 每张图片都必须先在线搜索，再在导出前验证为 `HTTP 200` 且 `Content-Type: image/*`。可用后备直链及验证流程见 `verified-image-sources.md`。

## Extended Visual Types

### img-text

```json
{
  "type": "img-text",
  "items": [
    { "name": "Studio", "imgUrl": "https://images.unsplash.com/photo-1560869683-94e483e13bb0?auto=format&fit=crop&w=1200&q=80", "href": "" }
  ],
  "fontSize": 16,
  "color": "#111111",
  "bgColor": "#ffffff",
  "radius": 16
}
```

### video-player

```json
{
  "type": "video-player",
  "url": "https://example.com/video.mp4",
  "bgColor": "#000000"
}
```

### countdown

```json
{
  "type": "countdown",
  "title": "Registration closes in",
  "targetDate": "2026-08-01",
  "bgColor": "#111827",
  "color": "#ffffff"
}
```

### tabs

Use one to five tabs. Each tab may contain the same supported visual child types.

```json
{
  "type": "tabs",
  "activeColor": "#2563eb",
  "tabs": [
    {
      "title": "Overview",
      "height": 240,
      "bgColor": "#ffffff",
      "children": []
    }
  ]
}
```

### accordion

```json
{
  "type": "accordion",
  "items": [
    { "title": "What is included?", "content": "A concise answer." }
  ],
  "bgColor": "#ffffff",
  "borderColor": "#e5e7eb",
  "activeColor": "#2563eb"
}
```

### map

```json
{
  "type": "map",
  "address": "Venue address",
  "embedUrl": "https://www.google.com/maps/embed?...",
  "linkUrl": "https://maps.google.com/..."
}
```

Only use a real embeddable map URL. If none is available, prefer a text address and button instead.
`map` must be the only child of its IR section and compiles as a top-level page block.

### rating

```json
{
  "type": "rating",
  "rating": "4.8",
  "reviewCount": "128",
  "color": "#f59e0b"
}
```

Do not invent ratings or review totals. Use this component only when the user or current project provides those values.

### social-share

```json
{
  "type": "social-share",
  "title": "Share this page",
  "showFacebook": true,
  "facebookUrl": "",
  "showTwitter": true,
  "twitterUrl": "",
  "showLinkedin": true,
  "linkedinUrl": "",
  "showWhatsapp": true,
  "whatsappUrl": "",
  "showEmail": true,
  "emailUrl": "",
  "buttonStyle": "rounded"
}
```

### person-profile

```json
{
  "type": "person-profile",
  "avatar": "https://images.unsplash.com/photo-1752650143267-57c2491f5ba2?auto=format&fit=crop&w=1200&q=80",
  "name": "Person name",
  "title": "Role",
  "bio": "Short biography",
  "email": "",
  "phone": "",
  "linkedin": "",
  "twitter": "",
  "website": "",
  "avatarSize": 120
}
```

Do not invent contact details. Omit or leave unknown values empty.

### inquiry-box

```json
{
  "type": "inquiry-box",
  "title": "Contact us",
  "nameLabel": "Name",
  "contactLabel": "Phone or email",
  "inquiryTitleLabel": "Subject",
  "contentLabel": "Message",
  "pictureLabel": "Picture (optional)",
  "submitButtonText": "Submit",
  "successMessage": "Your inquiry has been submitted.",
  "primaryColor": "#2563eb",
  "buttonColor": "#2563eb",
  "buttonTextColor": "#ffffff"
}
```

`inquiry-box` must be the only child of its IR section and compiles as a top-level page block.

## Top-level Business Components

Every top-level component must be the only non-navbar child of its IR section. The section is an ordering carrier only: it is removed during compilation and the component is emitted directly beside surrounding `free-box` objects. Do not arrange siblings around it. When a heading or explanation is needed, place that content in the preceding free-form section.

This applies to `goods-list`, `coupon`, `navigation`, `search`, `banner`, `store-information`, `discount-promotion`, `service-list`, `event-list`, `event-calendar`, `blog-list`, `map`, and `inquiry-box`. Input aliases are accepted as `product-list` → `goods-list`, `blog` → `blog-list`, `inquiry` → `inquiry-box`, and `storeinfo`/`store-info` → `store-information`.

Example compiled event block:

```json
{
  "label": "Event List",
  "type": "event-list",
  "component": {
    "name": "event-list",
    "props": {
      "data": {
        "events": [],
        "styleMode": 0
      }
    }
  },
  "id": "3f9bd730-0570-4669-9871-e3ee35a86929"
}
```

### goods-list and discount-promotion

Accepted presentation fields: `gap`, `num`, `mode`, `source`, `isShadow`, `attribute`, `isVoucher`, `allProducts`, `color`, `bgColor`, `marginTop`, and `marginBottom`.

- Keep runtime `list` empty; the compiler does this automatically.
- Default to automatic/all-products mode. Do not invent products.

### coupon

Accepted fields: `title`, `subtitle`, `logo`, `couponName`, `merchantName`, `themeColor`, `titleColor`, `subtitleColor`, `backgroundImage`, and the corresponding `*FontFamily`, `*FontSize`, and `*FontWeight` fields emitted by the compiler.

Only use merchant/coupon details supplied by the user or current project. Otherwise use neutral editable labels, not factual offers.

### navigation

Accepted fields: `shape`, `pageNum`, `rowNum`, `iconSize`, `color`, `bgColor`, `opacity`, `fontWeight`, `fontStyle`, `textDecoration`, and `items`. Each item accepts `text`/`label`, `useText`, `mode`, `link`, `icon`, `color`, and `backgroundColor`.

Provide at least one real navigation item; an empty navigation component is a validation error.

### brand-navbar

Accepted fields: `brandName`, `logo`, `showLogo`, `mode`, `itemGap`, `paddingX`, `height`, `bgColor`, `color`, `brandFontSize`, `navFontSize`, `fontWeight`, `layout`, `styleColor`, `typography`, `iconStyle`, and `items`.

Only one navbar may exist in an IR. A navbar-only carrier section is removed after the navbar is promoted to the top level.

### search

Accepted fields: `mode`, `placeholder`, `backgroundColor`, `color`, `bgColor`, `opacity`, `padding`, and `radius`.

### banner

Accepted fields: `mode`, `height`, `color`, `bgColor`, `opacity`, `indicatorDots`, `autoplay`, and `items`. Each item accepts `pic`/`src`/`url` and `link`.

Banner items are allowed only with searched and verified HTTP(S) raster-image direct URLs. Do not emit an empty decorative banner or any SVG/local/generated source.

### store-information

Accepted fields: `backgroundImage`, `logo`, `storeName`, `slogan`, `phone`, `email`, `address`, and `businessHours`. Do not invent contact or business details.

### service-list

Accepted fields: `storeName`, `logo`, and `themeColor`. Keep `services` empty; the component loads runtime data.

### event-list

Accepted field: `styleMode`. Keep `events` empty and place the component in its own section.

### event-calendar

Accepted fields: `viewMode`, `styleMode`, `themePreset`, `primaryColor`, `secondaryColor`, `accentColor`, `backgroundColor`, `surfaceColor`, `textColor`, and `mutedTextColor`. Keep `events` empty.

### blog-list

Accepted fields: `titleColor`, `titleFontSize`, `titleFontWeight`, `subtitleColor`, `subtitleFontSize`, `subtitleFontWeight`, and `bgColor`. Keep `blogContents` empty.

## Constraints

- Use stable unique component IDs.
- Keep `x + w <= 386` unless overflow is explicitly requested.
- Keep every non-overflow child bottom (`y + h`) within its section height.
- Same-column text and rich-text boxes must not overlap and should have at least 8px vertical separation.
- Images, rectangles, and circles that overlap readable or interactive content must use a lower `zIndex`; do not overlay a separate text component on a button.
- Button horizontal and vertical padding default to `0`.
- Text-bearing rectangles must omit `h` for automatic card sizing or provide enough explicit height to contain all higher-layer content plus bottom padding.
- Newly generated image-bearing components may use only searched, verified HTTP(S) raster-image direct URLs; SVG and local/generated image sources are forbidden.
- Business components load their own runtime data. Leave `list`, `events`, `services`, and `blogContents` empty and configure only presentation, source mode, counts, and filters documented by the IR.
- `goods-list` and `discount-promotion` default to automatic/all-products data mode unless the user explicitly requests a selection mode.
- Top-level/business components are never nested in `component_list`; the compiler removes their dedicated IR carrier and preserves their order beside `free-box` entries.
- `brand-navbar` is a top-level component; the compiler removes it from section children and emits it before other page blocks.
- Existing canonical components must never be recreated through compact IR during an edit. Use `mode: "extend"` and include only new sections.
- Every top-level/business component occupies a dedicated one-child IR section and compiles directly to the top-level `designJson` array. Legacy canonical top-level components are preserved during `extend`.
- Do not generate empty `video-player` or image components merely as placeholders. If no usable media URL exists, omit the media component and retain explanatory text only when the user needs it.
- Do not invent URLs, ratings, contact details or dates presented as facts.
- Unknown component types are compilation errors and must be removed or replaced deliberately.
