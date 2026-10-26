# Honour Tile Society — bright Hong Kong heritage and hospitality

## Evidence and inferred brief

User-supplied full screenshot and page JSON, imported from `t4` on 2026-10-26. No original brief was supplied. The inferred goal is to present a Hong Kong-style Mahjong gathering with warmth, cultural memory, food and an approachable participation path. The brand, Denver location, menu partner, statistics, quotes and event policies are archived source copy, not independently confirmed business facts.

Open [screenshot.png](screenshot.png), then [page-map.json](page-map.json) to locate content in the complete [page.source.json](page.source.json). [assets.json](assets.json) maps media positions and replacement roles. [page.placeholders.json](page.placeholders.json) retains the complete source sequence with native image placeholders and cleared links. Shared reading and reuse rules are in [the case library](../../case-library.md).

## Full-page sequence

The source contains 14 top-level sections, a nested rules container and 8 image components. Several early sections jointly form the first-screen brand/introduction experience; two sections are narrow decorative dividers. Treat this as a narrative, not a requirement to reproduce 14 blocks.

| Source index / ID | Visitor question or transition | Content and composition |
| --- | --- | --- |
| 0 / `73a5533c-b4df-4b83-9e67-f7407d1b407f` | Who and where? | Narrow green utility masthead. |
| 1 / `sec-0` | What is the brand's character? | Arched signboard-like identity panel over a mint grid; short promise labels sit beneath it. |
| 2 / `sec-1` | What world does the brand evoke? | Street/shop-sign photograph and caption supply a concrete place-based reference. |
| 3 / `sec-2` | What is the gathering and how do I join? | A yellow editorial-note panel explains the offering and presents actions. |
| 4 / `sec-3` | Chapter transition | Narrow green/paper checker motif. |
| 5 / `sec-4` | Why does the community exist? | Numbered chapter heading, framed statement, story, one arched group photo and two smaller images. |
| 6 / `sec-5` | What are the house rules? | A deep-green rules board on a pale-mint section, with clear title/list hierarchy. |
| 7 / `sec-6` | How do I take part? | Numbered joining rows followed by a table/detail photo. |
| 8 / `sec-7` | Chapter transition | Narrow red/paper checker motif echoes the earlier divider. |
| 9 / `sec-8` | Is hospitality part of the experience? | Warm-yellow chapter, arched partner portrait, explanation and compact menu-like list. |
| 10 / `sec-9` | What does the community say about itself? | Grid surface, source metrics, quote panels and a closing statement. These claims need replacement or omission. |
| 11 / `sec-10` | What details define the atmosphere? | Two framed detail photos with short captions. |
| 12 / `sec-11` | What practical doubts remain? | Numbered questions and concise answers in a bounded list. |
| 13 / `sec-12` | Where can I take the next step? | Deep-green closing identity with compact promise labels and a social action. |

## Visual decisions to borrow

- **A recognizable identity silhouette:** the arched signboard and compact brand grouping create a memory cue. Reinterpret the signboard relationship for the new brand rather than copying the original name or exact artwork.
- **Place-specific imagery:** the street scene makes the Hong Kong reference tangible. In a new design, a supplied interior/table/thermos photo can play that role; a random “vintage” texture alone cannot supply the same content.
- **Bright does not mean flat:** pale mint, warm paper and yellow occupy most of the page; deep green and brick-red provide local emphasis in rules, actions and headings.
- **Motifs connect chapters:** grids, square indices, fine rules, small captions and checker strips recur selectively. The content still changes form: story, rules board, joining steps, portrait/menu, photo pair and FAQ.
- **Image shape relates to identity:** arched frames repeat the signboard idea in selected portraits/group photos; smaller square details keep that shape from becoming monotonous.
- **Content carries hospitality:** participation rules and food information make the gathering concrete. More decorative marks would not replace these answers.

Observed roles include paper `rgb(252, 246, 232)`, mint `rgb(220, 234, 224)`, jade `rgb(63, 122, 101)`, brick `rgb(192, 57, 46)` and warm yellow. The source pairs Noto Serif TC-style display type with DM Mono/utility and sans body roles. These are observations of the source. Use supported fonts and the active skill's output-language policy when creating a new page; archived bilingual text is not an exception.

## Asset and content preparation

The eight image slots are a street scene, three community images, a table/detail photo, a partner portrait and two atmosphere details. All are reference-only. In a placeholder draft, preserve the distinct wide, arched and paired frames. Label the proposed new roles, such as `ROOM PHOTO — TO BE PROVIDED` or `TABLE DETAIL — TO BE PROVIDED`; do not extract the source street, people or brand imagery from the screenshot.

For the user's bright 1970s Hong Kong Mahjong direction, use this case as the primary visual reference. Build a new content sequence around the actual reservation goal: identity/offer → next session → environment → what happens → beginner/rules guidance → practical questions → booking. If the brand has a thermos/interior reference, use it to choose an appropriate visual motif; this case itself does not establish Camel-brand thermos history or supply thermos assets.

Replace or omit the source's Denver identity, 1974 label, partner/menu, “200+”/“50+” figures, testimonials, age restriction, cancellation process and reservation provider. Do not invent a chef chapter or proof section just to match the screenshot. With placeholder permission, date/venue/fee can be explicitly pending while the experience and structure remain concrete.

## Source limitations

- Several source sections are named `DIV` or have no section name. Use the semantic chapter mapping above when planning; do not carry generic names into a new design.
- The rules board contains a nested `free-box`. Adapt its hierarchy using the current contract rather than assuming nested source schema is accepted as IR.
- Source chapter indices/kickers are inconsistent in places. Borrow the index-and-rule motif, not the numbering errors.
- The source includes large z-index values, a street image extending beyond its section width and gradient/customCSS expressions. Recompute these choices against the active renderer; do not treat them as approved compatibility fixtures.
- The placeholder page retains historical text and geometry for study and has not been compiled or rendered. Source media are not publishable assets for new work.
