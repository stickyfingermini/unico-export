# Case Study Excerpts: Three High-Fidelity References

Read this alongside `case-derived-layout-rules.md` before authoring a new page or full redesign. These excerpts are taken from the user-provided production JSON files in `ai-learning-cases/`. They preserve real copy fragments, coordinates, sizes, colors, and layering as concrete evidence, flattened into compact IR-like notation for readability. The excerpts are not verbatim source JSON or complete compiler-valid components. Use them as composition studies and translate their patterns into the current compact IR; do not paste production JSON into IR or copy a whole page.

The examples use the original 386px mobile design space. Some source objects contain legacy overflow, very high z-index values, missing image sources, or CJK copy. Those are evidence of the visual intent only. Keep generated page text English-only, use valid current IR fields, keep content within the canvas unless a deliberate bleed/rail is declared, and resolve image assets under the current asset rules.

## 1. Boba Run Club: Brand Utility Header + Layered Night Poster

### Header excerpt

The header is five independent pieces rather than a generic navigation bar: two left-aligned wordmark lines, a compact two-line location/utility label, a small graphic mark, and a right action. Original positions:

| Element | x, y | w | Type treatment |
| --- | --- | ---: | --- |
| `SOCAL` | 15, 10.8 | 64 | 16px, weight 800, orange |
| `BOBA RUN CLUB` | 13, 35.19 | 99 | 7px, tracked, muted warm tone |
| `LA / OC` / `ALL NIGHT` | 214.63, 17.31 | 61 | 8px, bold, two-line utility |
| Small brand mark | 269, 22 | 61×16 | raster/logo slot |
| `FOLLOW` | 310, 20 | 64 | 12px, bold, light text, action |

**Imitate the relationship:** brand lockup occupies the left; compressed context and one action share the right half. The tiny subline makes the wordmark feel like a designed identity system. On a different project, replace location and follow with useful content and a goal-relevant action. Do not copy the exact words or force a logo slot if none is needed.

Visual-spec excerpt from the source (selected fields only; not a complete component):

```json
[
  { "type": "text", "text": "SOCAL", "x": 15, "y": 10.8, "w": 64, "fontSize": 16, "fontWeight": 800, "color": "#ff9b32" },
  { "type": "text", "text": "BOBA RUN CLUB", "x": 13, "y": 35.19, "w": 99, "fontSize": 7, "color": "#e8c6a2" },
  { "type": "text", "text": "FOLLOW", "x": 310, "y": 20, "w": 64, "fontSize": 12, "fontWeight": 700, "color": "#FFF0D8" }
]
```

### Hero excerpt

The hero treats the first screen as a poster: a full-width photo frame (`x=1, y=0, 384×656`), a huge low-contrast `SBR` wordmark behind the foreground (`x=153, y=61, 301px wide, 125px font, translucent orange`), a small orange location strip at the top, and three oversized headline beats around `y=315`, `371`, and `426`. The short explainer sits at `x=17, y=491`; paired actions sit at `y=582`.

Copy fragment from the source: **“THE BOBA / RUN / AFTER DARK.”** The words are split into separate visual beats and colors; they are not typeset as one ordinary paragraph. A narrow descriptor above establishes context before the large type takes over.

```text
photo/background       x=1    y=0     w=384  h=656  z=0
translucent wordmark   x=153  y=61    w=301  fs=125 z=5
eyebrow strip          x=17   y=17    w=161  h=20
oversized title beat   x=16   y=316   w=350  fs=48
body copy              x=17   y=492   w=310  fs=13
paired actions         y=582   h=48
```

**Imitate the relationship:** make the image, oversized wordmark, and headline occupy distinct layers; use color and staggered baselines to create motion. Keep the title readable over the photo with sufficient contrast or a restrained overlay. Make the blank space between the title and lower copy intentional, not accidental. Recalculate geometry for current copy instead of copying these coordinates verbatim.

### Poster rail excerpt

The `Poster Rail` uses five image slots and four small labels such as `UP NEXT`, `AFTER DARK`, and `PARTNER DROP`. A representative card frame is about `242×303`; cards begin at x positions around `21`, `270`, `530`, and `784`, so the track is much wider than the mobile canvas. The source is a deliberate horizontal gallery concept, not four squeezed thumbnails.

**Current IR translation:** create a clipped horizontal sequence with variable poster widths, aligned bottoms, and a small label on selected posters. Declare and validate the intended overflow; retain an on-canvas focal poster and make the next poster partially visible as a cue to scroll. Do not allow a whole page to overflow just to simulate a rail.

### Timeline as a different section rhythm

`THE RUN OF SHOW / ONE NIGHT. FOUR ACTS.` begins as a split heading: a large left title and a narrow explanatory column at the right. Four time markers (`2PM`, `5PM`, `8PM`, `LATE`) then align in a left rail, with activity title and one short sentence to the right, separated by fine rules. This provides a typographic section between image-heavy sections without reverting to cards.

## 2. Honour Tile Society: Numbered Editorial Chapters + Hard-Edge Motifs

### Opening composition excerpt

The opening uses a warm paper panel inside the 386px canvas (`x≈18, y≈58, w≈350, h≈297`). Within it, a small centered location line sits above a large two-line display identity (`font≈52px`); a short horizontal accent rule separates it from the Latin brand name and a compact descriptor. Three small, square-cornered badges sit below the panel in a single row.

The source copy includes a bilingual name and labels. The reusable idea is **large identity → short rule → secondary brand line → descriptor → compact proof/attribute strip**. For an English-only output, use the user's English brand and factual attributes; never copy the source's Mahjong wording into an unrelated page.

### Chapter header excerpt

The `About Us` chapter starts with a red square holding `01`, a contrasting small chapter glyph, and a thin horizontal rule extending to the right. Below are a large left-aligned heading (`About Us`, about 34px), a small tracked kicker (`TABLE NOTE / ...`), then an asymmetric feature card. A large arched/rounded top surface holds a short editorial statement; a small square marker punctuates it. The chapter continues with body copy and a wide image field, then two smaller image tiles.

```text
chapter marker         x=22   y=36   30×30   red field + light `01`
chapter rule           x=85   y=50   w=279  h=1
heading                x=22   y=79   fs≈34  “About Us”
tracked kicker         x=22   y=124  fs≈10  “TABLE NOTE / ...”
feature surface        x=22   y=161  w=343  h=177  pale green, asymmetric top radius
statement              x=46   y=197  w=293  fs≈22
wide image             x=35   y=547  w=319  h=190
two detail images      x=30/207 y≈787 each ≈151×138
```

The next chapter repeats the index/rule/title/kicker but changes the content grammar into four numbered horizontal steps. Each step pairs a narrow color number rail with a wider title and body area. This is the key lesson: repeat the navigation signature, vary the section's main layout. Do not turn every chapter into the same card.

Visual-spec excerpt from the source (selected fields only; not a complete component):

```json
[
  { "type": "rectangle", "x": 21.8, "y": 35.6, "w": 29.7, "h": 29.7, "bgColor": "#c0392e", "zIndex": 1 },
  { "type": "text", "text": "01", "x": 21.8, "y": 38, "w": 29.7, "fontSize": 11.9, "color": "#fcf6e8", "zIndex": 3 },
  { "type": "line", "x": 85.1, "y": 50, "w": 279.1, "h": 1, "bgColor": "rgba(110, 67, 37, 0.3)", "zIndex": 2 },
  { "type": "text", "text": "About Us", "x": 21.8, "y": 79.2, "w": 342.5, "fontSize": 33.7, "fontWeight": 700, "color": "#6e4325", "zIndex": 3 },
  { "type": "text", "text": "TABLE NOTE", "x": 21.8, "y": 123.8, "w": 342.5, "fontSize": 9.9, "color": "#3f7a65", "zIndex": 3 }
]
```

The source JSON stores colors as a mix of hex and `rgb()` strings and has z-index values above 1000. The excerpt above normalizes colors for readability and preserves the layer ordering only conceptually. In new IR, use the page theme tokens and a small practical z-index range (for example 0–5); do not paste legacy z-index values.

### Color and overlap excerpt

The visible system relies on a small set of hard-edged colors—warm cream paper, deep brick red, muted jade, and yellow—plus one-pixel rules and cut-corner/square geometry. A photo frame occasionally crosses or sits over a color field; captions anchor the image edge. Keep the palette page-level and semantic in new IR, and use generated decorative raster texture only if it improves the subject fit. The supplied JSON contains duplicated rectangles and high z-index artifacts; recreate the intentional shape/image relationship once, with simple z-order, instead of copying editor residue.

## 3. North Brooklyn Chess: Off-Center Type + Color-Plate Image Anchor

### Header excerpt

The header splits the identity into three aligned items: a stacked `NORTH / BROOKLYN / CHESS` wordmark at `x=53, y=11` (69px wide, 10px bold), a tiny chess glyph at `x=19, y=11` (27×36), and `BROOKLYN, NYC` at `x=272, y=21`. A white rule spans from `x=16` to `370` at `y=53`. It feels like a masthead, not a menu.

**Imitate the relationship:** compact identity at one edge, one piece of contextual metadata at the other, then a rule that closes the header and opens the hero. Substitute metadata that matters to the user's page. If navigation is necessary, add only the shortest useful utility/action.

### Hero excerpt

The headline is deliberately off-center and split across two giant lines: `YOUR MOVE,` begins at `x=21, y≈120`, width 268, font 62; `BROOKLYN.` begins at `x=20, y≈272`, width 326, font 62, and uses the accent color. A blue art plate starts at `x=37, y=358` (`330×282`); the photograph sits slightly inset at `x=29, y=358` (`320×272`). A small orange caption plate crosses the lower-right photo edge. Supporting copy sits below/alongside the image instead of being put inside another card.

```text
masthead rule          x=16   y=53    w=354 h=1
eyebrow/color label    x=16   y=78    w=273 h=29
headline line 1        x=21   y=120   w=268 fs=62 “YOUR MOVE,”
headline line 2        x=20   y=272   w=326 fs=62 “BROOKLYN.”
color plate            x=37   y=358   w=330 h=282 z=0
photo                  x=29   y=358   w=320 h=272 z=2
caption plate          x=245  y=597   w=132 h=31  z=2
```

**Imitate the relationship:** reserve real vertical space for large type, use two independent lines when the message benefits from different alignments or colors, then let the image break into the lower type field. Offset the photo against a larger backplate so the frame reads as art direction. The caption can intentionally cross the frame edge. Keep it readable and within the canvas; in the source the caption text box extends past the right edge, which should not be copied.

Visual-spec excerpt from the source (selected fields only; not a complete component):

```json
[
  { "type": "text", "text": "YOUR MOVE,", "x": 21, "y": 119.5, "w": 268, "fontSize": 62, "fontWeight": 800, "color": "#ffffff", "zIndex": 3 },
  { "type": "text", "text": "BROOKLYN.", "x": 20, "y": 272.3, "w": 326, "fontSize": 62, "fontWeight": 800, "color": "#fb4f14", "zIndex": 3 },
  { "type": "rectangle", "x": 37, "y": 358.09, "w": 330, "h": 282, "bgColor": "#002395", "zIndex": 0 },
  { "type": "img", "x": 29, "y": 358.09, "w": 320, "h": 272, "zIndex": 2 }
]
```

### The room: asymmetric split and deliberate supporting images

The `The Room` section uses a large photo on the left (`x=17, y=81, about 173×297`) and a blue text panel on the right (`x≈201, y=80, about 169×299`). The heading kicker sits above the columns. Three small landscape images form a separate strip below. This creates two scales of image in one section and leaves the right column to carry the headline and body.

### Motion gallery: nonuniform mosaic excerpt

`THE CLUB IN MOTION` uses 22 images over an approximately `354×763` gallery. Its repeated columns are about `84.75 / 174.5 / 84.75px`; most rows are 91px tall, while selected edge images span 187px. The wide center cell alternates between columns and the tall images appear at different edges, creating a woven rhythm while preserving a stable grid.

```text
gallery width ≈ 354
column widths ≈ 85 | 175 | 85
row unit ≈ 91
selected portrait cells ≈ 85×187 (span 2 rows)
selected wide cells ≈ 175×91 (span 2 columns)
```

**Imitate the relationship:** for a real photo collection, use a stable column rhythm with a few larger spans and change which column receives the tall/wide frame. Select crops by subject; do not repeat one rigid thumbnail size. Use fewer images when the content set is small—the 22-image count is specific to this supplied case, not a quota.

## How to Use These Excerpts

Before writing IR, select one reference move from at least two different cases, then adapt each to the user's brand, content, assets, and goal. Record the adaptation in the design profile's layout/image-rhythm rationale. Preserve the helpful geometry relationships (scale, offset, hierarchy, rhythm), but recompute exact coordinates and heights for the current text, font, image ratio, canvas, and compiler. Do not combine all three case palettes or signatures into one page. A good adaptation should be recognizable in its layout logic while clearly belonging to the new page.
