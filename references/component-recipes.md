# Component Recipe Library

Use this library when creating or redesigning a page. A recipe is a reusable component combination, not a whole-page template. Select **2–4 recipes** that match the brief, place them in the section storyboard, and adapt their copy, colors, and geometry. Keep the visual construction simple by default; use advanced treatments only when the brief asks for them. Every new page/full redesign must call R10 or another photo recipe at least once to create a real image module. If the user names a technique, call the matching recipe directly. Do not invent the combination again from scratch or use every recipe on every page.

These recipes distill the recurring construction language in `json-cases/mahjongsosyal/target.json` and `json-cases/HONOUR TILE SOCIETY/target.json`: rounded multi-text cards, outlined image frames, hard-offset shadows, patterned rectangle surfaces, capsule labels, overlapping type, and irregular image mosaics. Add underline and hollow-outline combinations when the brief asks for them. All examples use the IR shorthand from `component-contract.md`; replace IDs, theme colors, copy, and coordinates before compilation.

## R01 — Centered information card

**Build:** one rounded `rectangle` backplate + eyebrow `text` + heading `text` + body `text` + optional small badge. Keep every text component on top of the plate and inset from its edge.

```json
[
  { "type": "rectangle", "id": "card-main", "x": 22, "y": 24, "w": 342, "bgColor": "#FFF6D7", "borderColor": "#18151A", "borderWidth": 2, "radius": 16, "zIndex": 1 },
  { "type": "text", "id": "card-kicker", "text": "CHAPTER 01 · THE TABLE", "x": 40, "y": 42, "w": 300, "paddingInline": 0, "paddingBlock": 0, "fontSize": 10, "fontWeight": 700, "letterSpacing": 1.4, "color": "#6A1985", "zIndex": 2 },
  { "type": "text", "id": "card-title", "text": "A table for new stories", "x": 40, "y": 74, "w": 300, "paddingInline": 0, "paddingBlock": 0, "fontSize": 22, "fontWeight": 800, "lineHeight": 1.1, "color": "#18151A", "zIndex": 2 },
  { "type": "text", "id": "card-body", "text": "Add useful, confirmed details that explain what happens and who it is for.", "x": 40, "y": 115, "w": 300, "paddingInline": 0, "paddingBlock": 0, "fontSize": 14, "lineHeight": 1.4, "color": "#39333A", "zIndex": 2 }
]
```

Leave the card rectangle height omitted so the compiler can size it around the content. For a compact feature list, repeat the complete recipe with distinct content and a changed accent—not just another blank card.

## R02 — Photo with rounded print frame

**Build:** an offset color `rectangle` behind an `img`; optionally add a transparent outlined `rectangle` over the photo. The image and frame use matching radii. This turns a generic image into a deliberate editorial plate.

```json
[
  { "type": "rectangle", "id": "photo-plate", "x": 31, "y": 36, "w": 324, "h": 228, "bgColor": "#F41AD5", "radius": 20, "zIndex": 1, "autoFitContent": false },
  { "type": "rectangle", "id": "photo-frame", "x": 22, "y": 26, "w": 324, "h": 228, "bgColor": "#FFF6D7", "borderColor": "#18151A", "borderWidth": 2, "radius": 18, "zIndex": 2, "autoFitContent": false },
  { "type": "img", "id": "photo-main", "src": "https://example.com/verified-photo.jpg", "x": 26, "y": 30, "w": 316, "h": 220, "fit": "cover", "radius": 14, "zIndex": 3 }
]
```

Replace the example URL with an actual verified direct raster URL. Choose crop and focal point before choosing text placement. If the outline is visually too heavy, omit it; the offset plate still gives the image a frame.

## R03 — Hard offset shadow

**Build:** a backplate rectangle shifted a few pixels down/right + the foreground card rectangle + readable text. This geometric shadow is deterministic when CSS `box-shadow` support is uncertain.

```json
[
  { "type": "rectangle", "id": "card-shadow", "x": 27, "y": 31, "w": 338, "h": 132, "bgColor": "#F41AD5", "borderColor": "#18151A", "borderWidth": 2, "radius": 14, "zIndex": 1, "autoFitContent": false },
  { "type": "rectangle", "id": "card-face", "x": 21, "y": 25, "w": 338, "h": 132, "bgColor": "#FFF6D7", "borderColor": "#18151A", "borderWidth": 2, "radius": 14, "zIndex": 2, "autoFitContent": false },
  { "type": "text", "id": "card-face-title", "text": "THE NEXT TABLE", "x": 39, "y": 43, "w": 302, "paddingInline": 0, "paddingBlock": 0, "fontSize": 20, "fontWeight": 800, "color": "#18151A", "zIndex": 3 }
]
```

Use `autoFitContent: false` here because the faces have deliberate fixed geometry. For content-driven cards, prefer R01 and a preview-verified `box-shadow` declaration on the card rectangle, as seen in the target JSON.

## R04 — Underlined utility text

**Build:** a short text label using the structured text decoration field. Prefer it for a link-like label, emphasized word, or editorial annotation—not as body-copy styling.

```json
{
  "type": "text", "id": "underlined-label", "text": "VIEW THE FIELD NOTES", "x": 24, "y": 28, "w": 250, "paddingInline": 0, "paddingBlock": 0,
  "fontSize": 11, "fontWeight": 700, "letterSpacing": 1.2, "textDecoration": "underline", "color": "#18151A", "zIndex": 2
}
```

## R05 — Patterned section field

**Build:** one section-sized `rectangle` at the lowest layer + content components above it. A CSS pattern is compact and flexible; actual lines/dots made from small `rectangle` or `line` components are the fallback when the renderer does not show the CSS.

```json
[
  { "type": "rectangle", "id": "section-pattern", "x": 0, "y": 0, "w": 386, "h": 360, "bgColor": "#FFF6D7", "customCSS": "background-image: radial-gradient(rgba(7,59,40,.14) 1px, transparent 1px); background-size: 18px 18px;", "zIndex": 0, "autoFitContent": false },
  { "type": "text", "id": "pattern-section-title", "text": "PICK YOUR ENTRY POINT", "x": 20, "y": 34, "w": 346, "paddingInline": 0, "paddingBlock": 0, "fontSize": 24, "fontWeight": 800, "color": "#073B28", "zIndex": 2 }
]
```

Keep the pattern low contrast and away from dense reading areas. `customCSS` is passed through, not runtime-validated; confirm it in preview or use native geometry.

## R06 — Hollow frame with label

**Build:** transparent `rectangle` with a visible border + one or more text components placed inside or across an edge. Add `"transparent": "transparent"` to `designProfile.theme` so the compiler recognizes the clear fill. Use a square frame for technical/editorial panels or a large radius for a capsule.

```json
[
  { "type": "rectangle", "id": "outline-panel", "x": 24, "y": 48, "w": 338, "h": 112, "bgColor": "transparent", "borderColor": "#EBFF3C", "borderWidth": 2, "radius": 18, "zIndex": 1, "autoFitContent": false },
  { "type": "text", "id": "outline-panel-kicker", "text": "OPEN SEAT / 01", "x": 42, "y": 64, "w": 290, "paddingInline": 0, "paddingBlock": 0, "fontSize": 10, "fontWeight": 700, "letterSpacing": 1.4, "color": "#EBFF3C", "zIndex": 2 },
  { "type": "text", "id": "outline-panel-copy", "text": "Come curious. We will teach the rest.", "x": 42, "y": 96, "w": 290, "paddingInline": 0, "paddingBlock": 0, "fontSize": 17, "fontWeight": 700, "color": "#FFF6D7", "zIndex": 2 }
]
```

## R07 — Screen-print headline stack

**Build:** two or three short duplicate `text` components with small stepped offsets, different palette colors, and increasing z-index. Add `allowOverlap: true` only to the intentionally intersecting text layers. Keep a readable foreground copy.

```json
[
  { "type": "text", "id": "headline-ink-shadow", "text": "PLAY LOUD.", "x": 22, "y": 32, "w": 320, "paddingInline": 0, "paddingBlock": 0, "fontSize": 42, "fontWeight": 900, "lineHeight": 0.95, "color": "#F41AD5", "zIndex": 1, "allowOverlap": true },
  { "type": "text", "id": "headline-ink-mid", "text": "PLAY LOUD.", "x": 19, "y": 29, "w": 320, "paddingInline": 0, "paddingBlock": 0, "fontSize": 42, "fontWeight": 900, "lineHeight": 0.95, "color": "#EBFF3C", "zIndex": 2, "allowOverlap": true },
  { "type": "text", "id": "headline-face", "text": "PLAY LOUD.", "x": 16, "y": 26, "w": 320, "paddingInline": 0, "paddingBlock": 0, "fontSize": 42, "fontWeight": 900, "lineHeight": 0.95, "color": "#073B28", "zIndex": 3 }
]
```

This is for a few display words only. Do not duplicate paragraphs or apply the stack to every heading.

## R08 — Rotated signal tag

**Build:** compact bright rectangle + short text label. Rotate the plate with `line`/`img` structured controls when appropriate; for the text itself, use declaration-only `customCSS` only after preview confirms the renderer supports it.

```json
[
  { "type": "rectangle", "id": "signal-tag-plate", "x": 270, "y": 38, "w": 88, "h": 28, "bgColor": "#EBFF3C", "borderColor": "#18151A", "borderWidth": 2, "radius": 2, "zIndex": 3, "autoFitContent": false },
  { "type": "text", "id": "signal-tag-copy", "text": "LIVE TABLE", "x": 280, "y": 45, "w": 70, "paddingInline": 0, "paddingBlock": 0, "fontSize": 9, "fontWeight": 800, "letterSpacing": 1, "color": "#18151A", "zIndex": 4, "customCSS": "transform: rotate(-7deg); transform-origin: center;" }
]
```

If the rendered text does not rotate, leave the tag horizontal and rotate a nearby `line` or `img`; never treat an unpreviewed CSS value as implemented.

## R09 — Irregular photo mosaic (advanced, optional)

**Build:** two or three image frames of different proportions + offset solid-color plates + short captions. Use distinct, real image assets, deliberate `cover` crops, and a few aligned edges to keep the collage intentional.

```json
[
  { "type": "rectangle", "id": "mosaic-plate-a", "x": 24, "y": 28, "w": 210, "h": 156, "bgColor": "#1ED760", "zIndex": 1, "autoFitContent": false },
  { "type": "img", "id": "mosaic-photo-a", "src": "https://example.com/verified-wide-photo.jpg", "x": 18, "y": 20, "w": 210, "h": 156, "fit": "cover", "radius": 10, "zIndex": 2 },
  { "type": "rectangle", "id": "mosaic-plate-b", "x": 238, "y": 202, "w": 124, "h": 172, "bgColor": "#F41AD5", "zIndex": 1, "autoFitContent": false },
  { "type": "img", "id": "mosaic-photo-b", "src": "https://example.com/verified-portrait-photo.jpg", "x": 232, "y": 194, "w": 124, "h": 172, "fit": "cover", "radius": 10, "zIndex": 2 },
  { "type": "text", "id": "mosaic-caption", "text": "TABLE NOTES / 02", "x": 22, "y": 184, "w": 190, "paddingInline": 0, "paddingBlock": 0, "fontSize": 10, "fontWeight": 700, "letterSpacing": 1, "color": "#18151A", "zIndex": 3 }
]
```

Use only when a collage is explicitly requested or clearly central to the brief. Use only as many frames as distinct usable images are available. Never duplicate one temporary photo into several mosaic cells.

## R10 — Simple photo and caption

**Build:** one real `img`, one thin outlined `rectangle` behind it, and an optional short caption. Keep the frame close to the image bounds and use a single color; do not add extra shadow plates, tile drawings, stickers, or decorative clusters.

```json
[
  { "type": "rectangle", "id": "photo-frame-simple", "x": 20, "y": 24, "w": 346, "h": 214, "bgColor": "transparent", "borderColor": "#2D312B", "borderWidth": 1, "radius": 12, "zIndex": 1, "autoFitContent": false },
  { "type": "img", "id": "photo-simple", "src": "https://images.unsplash.com/photo-...?...", "x": 24, "y": 28, "w": 338, "h": 206, "fit": "cover", "radius": 9, "zIndex": 2 },
  { "type": "text", "id": "photo-caption-simple", "text": "A short contextual caption", "x": 24, "y": 248, "w": 338, "paddingInline": 0, "paddingBlock": 0, "fontSize": 11, "color": "#4A4D46", "zIndex": 2 }
]
```

Use the photo as the subject-specific visual. Source the image and record its license evidence using `verified-image-sources.md`; the sample URL is illustrative and must be replaced with a real provider CDN URL.

## Case-derived modular combinations

These are the repeatable section-level combinations seen across the two target cases. Call the IDs in the storyboard, then fill them with the current brief's real content. Unless a recipe says otherwise, keep its geometry flat and simple: one or two rectangles, clear text hierarchy, and no subject-matched miniature illustrations.

### R11 — Numbered editorial section header

**Build order:** small filled `rectangle` number tile → `text` Arabic index → `text` Chinese/Roman index (optional) → thin `line` or `rectangle` rule → large section-title `text` → small mono/utility subtitle `text`.

**Effect:** gives long pages a repeatable chapter system, like an editorial magazine. Reuse the same spacing and type roles; change only index, title, subtitle, and section surface. Keep alternate numeral systems synchronized.

### R12 — Full-width photo strap

**Build order:** full-width `img` with a deliberate crop → optional top/bottom `line` rules → small caption `rectangle` overlapping one edge → caption `text`.

**Effect:** introduces a place, event, or era in one image-led beat. Keep the overlay to one small label plate; do not add extra stickers or themed drawings. This is a simple image-first transition between text modules.

### R13 — Brand identity panel

**Build order:** flat section background → one centered or left-aligned `rectangle` panel → location/eyebrow `text` → brand wordmark/display `text` → short `line` accent → supporting statement `text` → two or three outlined `rectangle` tags with `text`.

**Effect:** makes the brand feel like a printed sign or editorial title card. Use one subtle grid only if requested by the art direction. The tags communicate verified traits; they are not miniature illustrations.

### R14 — Event information stack

**Build order:** section kicker/title/intro → optional announcement card (`rectangle` + badge/title/body) → featured event card (`rectangle` + status tag + event title + date + venue + price/availability when confirmed + RSVP `button`) → optional short “good to know” card with a few `text` bullets.

**Effect:** separates campaign context, the next actionable event, and participation notes while keeping them in one coherent section. Use two or three related surface colors, not a different visual system for every card. Only include event facts supplied by the user or source material.

### R15 — Three-row service list

**Build order:** section title/intro → repeat three times: wide `rectangle` card → one small flat color `rectangle` label block on the left → short label `text` inside it → service-title `text` and one-line explanation `text` on the right.

**Effect:** presents learning, recurring events, and hosting or other offers as a scannable set. Keep the left label abstract and typographic; do not draw a tile, icon, or object from many primitives. Vary label color within the same palette.

### R16 — Numbered participation steps

**Build order:** section header → repeat three to five times: outlined horizontal `rectangle` card → solid narrow number `rectangle` → number `text` → step-title `text` → one concise explanation `text` → optional single photo module after the steps.

**Effect:** makes an unfamiliar process feel easy to follow. Maintain one shared row template and increase vertical spacing only when copy needs it. Do not decorate each step with a separate illustration.

### R17 — Framed instruction board

**Build order:** section header → one large solid `rectangle` board with a simple border → small board-title `text` → repeat numbered rows, each using an index `text` and a `rich-text` sentence with a short emphasized lead-in plus plain explanation.

**Effect:** turns rules or practical notes into a single cohesive noticeboard. Limit surface detail to one border and at most one low-contrast texture; the copy and numbering carry the hierarchy.

### R18 — Stats and member quotes

**Build order:** section header → three equal small `rectangle` statistic cards, each with one large number `text` and a compact label → one or two larger quote `rectangle` cards, each with quote `text` and attribution `text` → optional closing statement on a contrasting flat panel.

**Effect:** moves from community scale to individual experience. Use only confirmed numbers and real approved testimonials; omit a statistic or quote when it is not provided. Do not replace missing evidence with invented metrics.

### R19 — Partner profile and menu/list

**Build order:** section header → one photo module → one simple profile `rectangle` containing name, role, short bio and optional supplied social handle → separate list `rectangle` with a title strip and two to four text-only rows.

**Effect:** connects a partner/person with a concrete offering. Use photo plus typography; do not construct food, people, or props from shapes. Include menu items and contact details only when confirmed.

### R20 — Two-photo comparison

**Build order:** section header → two same-size `img` modules side by side, each with one simple `rectangle` frame and one short caption `text`.

**Effect:** contrasts two useful aspects such as venue and people, or atmosphere and detail. Use two distinct real images, align their frames, and keep captions consistent. If there is only one suitable image, use R10 instead of duplicating it.

### R21 — FAQ stack

**Build order:** section header → repeat four to six times: flat outlined `rectangle` card → question `text` → answer `text` → small index `text` aligned in one consistent column.

**Effect:** answers practical objections in a predictable scan pattern. Keep question weight/size above answer weight/size. Do not use card ornaments beyond the outline and index.

### R22 — Brand statement poster

**Build order:** one strong flat-color section → one or two short display statements; optionally duplicate each statement once with a small color/position offset → one supporting paragraph → at most one large simple geometric `rectangle` accent.

**Effect:** creates one deliberate expressive pause in a long page. This is an advanced treatment: use only when poster-like energy is requested, and do not apply the stacked type to body copy or every heading.

### R23 — Simple closing footer

**Build order:** contrasting flat `free-box` background → brand name `text` → short descriptive `text` → one primary and one optional secondary `button` → thin divider `line` → compact legal/credit/year `text`.

**Effect:** closes the story and leaves the visitor with a clear next action. Keep the button count low and use only confirmed links and dates.

## Recipe selection rule

Create the page's component plan as `section → recipe IDs → content/assets`. Use 2–4 recipes for a broad page, including at least one photo recipe for every new page or full redesign. Repeat a recipe when it makes sense (for example, R11 for chapter headers or R21 for FAQs); a repeated instance does not count as a new recipe. Keep most choices simple and use at most one advanced expressive recipe unless the brief explicitly asks for a more elaborate art direction. Skip any recipe that conflicts with the brief. Every explicit technique requested by the user must map to a recipe ID and component IDs in the plan. Before delivery, verify those component IDs and fields in the compiled JSON; a recipe name in planning text is not evidence.
