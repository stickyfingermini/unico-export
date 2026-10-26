# Mahjong Club — beginner community and event journey

## Evidence and inferred brief

User-supplied full screenshot and page JSON, imported from `t1` on 2026-10-26. The original design brief was not supplied. The inferred goal is to introduce a Mahjong community, make unfamiliar rules approachable, and lead visitors toward a table or event. Source references to Milwaukee, named instructors and scheduled events are historical page copy, not verified facts.

Open [screenshot.png](screenshot.png) to inspect the page. Use [page-map.json](page-map.json) to locate sections, [page.source.json](page.source.json) for the complete original page array, and [assets.json](assets.json) for media roles. [page.placeholders.json](page.placeholders.json) is the full geometry-only study with source media replaced and links cleared. Shared reading/reuse rules are in [the case library](../../case-library.md).

## What makes this a complete page

The visitor sees what Mahjong is, how a hand develops, why the community exists, when to participate, who helps beginners, and what being there looks like. These are different information jobs. The source uses 10 top-level sections and 22 image components, including tile illustrations; those numbers describe the case and are not requirements for another page.

| Source index / ID | Visitor question | Content and composition |
| --- | --- | --- |
| 0 / `mj-hero` | What brings this community together? | Large stepped display title, a smaller italic word, supporting copy and a row of Mahjong tile cutouts create a concrete subject before the narrative. |
| 1 / `d9761e28-52b1-4ee2-baf2-1093bc04d9a9` | What game traditions does it mention? | Narrow colored style strip acts as a transition. Treat its rule labels as source content. |
| 2 / `mj-suits` | What am I looking at as a beginner? | Three suit groups plus a separate honors explanation turn the physical tiles into introductory content. |
| 3 / `mj-story` | Why does this gathering matter? | Editorial statement, table photograph and longer story paragraphs slow the rhythm after the teaching grid. |
| 4 / `mj-howto` | How does play progress? | Oversized step numbers and aligned title/body groups form a readable vertical procedure. |
| 5 / `mj-events` | What can I join next? | Date-led event rows prioritize a time/name/venue relationship over generic invitation text. |
| 6 / `mj-teachers` | Who will help me learn? | Two large portraits and specific roles give a human face to instruction. |
| 7 / `mj-gallery` | What does a session feel like? | One larger image, smaller supporting images and a caption form an asymmetric gallery. |
| 8 / `mj-cta` | What should I do now? | Tile motif returns above a short invitation and action. |
| 9 / `mj-footer` | How do I stay connected? | Compact closing identity, explanation and follow action. |

## Visual decisions to borrow

- **Subject-led hero:** separate headline beats give the tile cutouts room to function as the identity cue. For a new subject, select an equally specific object or visual role rather than replacing tiles with generic cards.
- **Teaching before persuasion:** illustrated categories and procedural steps supply useful information; the page does not rely on repeating “join us.”
- **Different reading speeds:** compact labels, a display statement, explanatory paragraphs, event rows and portrait captions require different amounts of attention and therefore different layouts.
- **Human scale:** large instructor portraits interrupt the small tile diagrams. A new page needs real authorized people or explicit portrait placeholders, not fictional teacher biographies.
- **Recurring motif:** tiles appear at the beginning and close; they do not need to decorate every section.

The observed palette is deep brown with cream and ochre text. Observed families include DM Serif Display and DM Sans. These describe the source, not installed-font or rendering guarantees. For a bright Hong Kong brief, borrow the content sequence and image relationships while replacing the deep fields with light surfaces and suitable contrast.

## Asset and content preparation

The 22 media slots comprise hero/teaching/closing tile illustrations, a table photograph, instructor portraits and session gallery imagery. `assets.json` preserves each source component ID and rectangle. The placeholder study labels available rectangles with numbered `PHOTO` or `ART` marks; small marks remain unlabeled geometry. Use the manifest to distinguish a tile graphic from a portrait even when their placeholder treatment is similar.

Before generating a new event page, obtain its rules variant, actual teaching arrangement, confirmed sessions and booking destination. The source's “144 tiles,” winning-hand explanations, instructor names, locations, dates and testimonials must not be treated as universal Mahjong rules or new-project facts. When placeholders are permitted, reserve those information positions with explicit pending labels; omit unconfirmed biographies and quotes.

## Source limitations

- The source includes a 1532px instructor section. Recompose or split it if the active contract requires smaller sections; do not treat this archive as a valid compiler fixture.
- Fonts, rich text, crop effects and image layering reflect the source renderer. Rebuild against the current contract and available fonts.
- Screenshot app chrome is outside the case design. Pixel equivalence between source JSON and screenshot has not been tested.
- The historical copy and media in `page.source.json` remain reference-only. The placeholder page is not an IR example or publish-ready output.

## A useful adaptation

For a beginner-friendly reservation page: identity/offer → next confirmed session → how the evening works → rules and host → table atmosphere → booking questions/action. Borrow the teaching hierarchy and portrait/gallery scale; choose the sections that the actual brief and available facts can support.
