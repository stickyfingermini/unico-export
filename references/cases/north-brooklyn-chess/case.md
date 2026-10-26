# North Brooklyn Chess — editorial identity and community evidence

## Evidence and inferred brief

User-supplied full screenshot and page JSON, imported from `t2` on 2026-10-26. No original brief was supplied. The inferred goal is to make a social chess club feel welcoming and culturally active, announce a next gathering, and show a real community through photographs and an event archive. Brand, schedule and social details are source-page content, not verified facts for another project.

Open [screenshot.png](screenshot.png), then use [page-map.json](page-map.json) to select sections from the complete [page.source.json](page.source.json). [assets.json](assets.json) maps media roles and source positions. [page.placeholders.json](page.placeholders.json) preserves the full layout for geometry-only study. See [the case library](../../case-library.md) for reading and reuse rules.

## Full-page sequence

The source has 7 top-level sections and 39 image components. A large part of that count is photography in one gallery, not a recommendation to fill every new page with images.

| Source index / ID | Visitor question | Content and composition |
| --- | --- | --- |
| 0 / `nbc-hero` | What is this club and why notice it? | Compact identity, utility strip, enormous italic headline, black-and-white chess photograph, blue backplate and orange caption lead to a clear invitation. |
| 1 / `nbc-next-move` | When is the next gathering? | Pale background makes a blue event-poster panel stand out. Time, event title, explanation and RSVP share a coherent information hierarchy. |
| 2 / `nbc-about` | Is this for people like me? | Short editorial explanation and three participation ideas make the club feel approachable. |
| 3 / `nbc-room` | What kind of room will I enter? | Tall portrait next to a narrow typographic panel, followed by a small photo strip. |
| 4 / `nbc-ledger` | Does a community actually exist here? | Nonuniform photo spans create a dense community album. The source contains 22 image components in this section. |
| 5 / `nbc-archive` | What has the club done before? | A poster archive with short captions supplies distinct historical objects. |
| 6 / `nbc-social` | How can I hear about the next one? | Orange closing field, display invitation and social destinations. |

## Visual decisions to borrow

- **Hierarchy with a clear subject:** the hero's title and photograph are both large; utility text stays small. The image supplies chess context instead of relying on generic decorative blocks.
- **Backplate relationship:** `nbc-hero-art-plate` sits behind `nbc-hero-photo` as a visible offset edge; the caption occupies another edge. Read section 0 for the actual field relationships, but compute new dimensions from the new image and copy.
- **Alternating surfaces:** black, pale paper, white, blue and orange give consecutive chapters different emphasis. A new brand can preserve this change of intensity with its own colors.
- **Asymmetry with reading order:** section 3 pairs a tall photograph with a narrow text column. This is useful when the text is short enough, not a reason to squeeze a long paragraph into a sliver.
- **Photography as content:** portraits, games, crowds and posters each contribute different evidence. Repeating one photo across a collage would lose that purpose.

Observed colors include black, white, `#f3f0e9`, `#002395` and `#fb4f14`. The source uses expressive Playfair Display-style italic headings against sans-serif utility/body text. Match the hierarchy with fonts supported by the active runtime; do not assume the archived family strings will render identically.

## Asset and content preparation

Plan a hero image, a distinctive room/participant image, additional session images only when available, and real event artwork only if the new brand has it. The 39 slots also include source marks and social icons; none are authorized output assets. Keep gallery and archive counts proportional to the new collection. In an authorized placeholder draft, distinct rectangles should preserve the planned wide/tall/square rhythm without claiming a real attendance history.

Replace the brand, Brooklyn identity, Thursday/time claims, RSVP target, social handles and all archive titles. Do not create fictional past events to justify an archive. If the new project has no history, use an activity preview or omit that chapter.

## Source limitations

- The source includes a logo within the hero rather than a separate Header section; follow the current skill's new-page masthead policy when adapting it.
- Gallery size and exact coordinates serve the supplied images. Do not import the ledger wholesale or retain source image URLs.
- Grayscale, contrast and crop declarations are historical renderer choices and need current-runtime support.
- `page.placeholders.json` retains the source typography, copy and geometry for study, clears actions and uses native image placeholders. It has not been compiled or rendered as part of packaging.

## A useful adaptation

For a restrained, bright Mahjong brand, borrow the strong title/photo scale, offset frame and a varied small gallery. Keep the light brand palette and authentic subject matter; do not automatically adopt black fields, electric blue, orange or a nightlife tone.
