# SoCal Boba Run Club — event posters and an evening's progression

## Evidence and inferred brief

User-supplied full screenshot and page JSON, imported from `t3` on 2026-10-26. The original brief was not supplied. The inferred goal is to introduce an event community mixing drinks, games and music, promote several happenings, and turn interest into event or follow actions. Locations, partners, schedules and audience claims belong to the archived page and are not verified facts for new work.

Open [screenshot.png](screenshot.png), read [page-map.json](page-map.json), then inspect relevant sections of [page.source.json](page.source.json). [assets.json](assets.json) records every media slot without granting reuse rights. [page.placeholders.json](page.placeholders.json) is a full geometry-only study. Shared rules are in [the case library](../../case-library.md).

## Full-page sequence

The source has 15 top-level sections and 19 image components, including poster layers outside the initial viewport. Some narrow sections are dividers or supporting rails, so the raw section count is not the number of content topics and is not a target for another design.

| Source index / ID | Visitor question or transition | Content and composition |
| --- | --- | --- |
| 0 / `sbr-header` | Who is hosting? | Compact brand and utility information establish identity without consuming a whole screen. |
| 1 / `sbr-hero` | What kind of night is this? | Crowd photo, subdued oversized wordmark, independently placed headline beats, short explanation and two actions. |
| 2 / `51b16baa-a61e-477e-8de6-2168f358c473` | What activities connect the brand? | Narrow activity ticker changes the pace. |
| 3 / `sbr-events` | What is coming up? | Editorial heading introduces the poster collection. |
| 4 / `1788504933542596753wb3` | Which event catches my interest? | Horizontal poster rail gives event artwork a useful role and signals more content at the edge. |
| 5 / `sbr-featured` | What deserves extra attention? | One large framed poster, readable event context and an action receive greater emphasis than the rail. |
| 6 / `sbr-club` | What happens over the evening? | Time-led run-of-show with short explanations and rules. |
| 7 / `sbr-pass` | How do I participate? | Three stepping cards introduce the social ritual. |
| 8 / `sbr-formula` | What is the mix of activities? | Offset blocks pair the drink/game/music sequence with concise copy. |
| 9 / `sbr-feed` | What does a gathering look like? | Large group photo plus two smaller images create an asymmetric chapter. |
| 10 / `sbr-upcoming` | Are there other ways to join? | Compact event rows use small artwork beside practical details. |
| 11 / `sbr-dance` | How does the night develop? | Two smaller images above a wide crowd image provide a second, distinct photo composition. |
| 12 / `sbr-cta` | What is the core experience? | Short visual summary and payoff statement. |
| 13 / `sbr-follow` | Where are future updates? | Profile identity, follow invitation and action. |
| 14 / `sbr-footer` | What closes the page? | Compact identity and final statement. |

## Visual decisions to borrow

- **Multiple headline layers with purpose:** a background wordmark carries identity while high-contrast foreground words carry the offer. Essential text must stay readable over a newly chosen image.
- **Events look like events:** original posters supply distinctive typography and illustrations, while adjacent editable copy and actions supply practical information. The screenshot is not evidence that new posters are available.
- **Different event scales:** a rail, one featured poster, a timeline and compact event rows communicate different priorities. Do not repeat every treatment if the new brief has only one event.
- **Intensity changes:** dark brown photo chapters alternate with orange explanatory/action chapters. For a quieter brand, preserve the change in emphasis with milder tones.
- **Photo chapters have different geometry:** the feed uses large-plus-small images; the dance chapter uses two-above-one. Their content jobs justify their shapes.

The observed system uses dark brown surfaces (`#3e1506`, `#551f0b`, `#6b2a12`), orange signal fields and cream copy, with heavy sans display text and small utility labels. These observations do not authorize copying its nightlife mood into a daylight or low-saturation brief.

## Asset and content preparation

The 19 source media slots include a hero crowd photo, poster layers, a featured poster, gallery images, event thumbnails, a profile mark and a small utility icon. Original posters, photos and brand marks cannot be reused. For a placeholder draft, keep large artwork frames visually distinct from small photo cells and label their intended roles; recreate important event title/time/action as editable text only from current facts.

Obtain the new activity sequence, dates, locations, entry requirements, confirmed partners and destinations. Do not copy the source's location, follower count, partner names, dates or RSVP claims. A one-event page may need a single event block plus timeline rather than an invented series and archive.

## Source limitations

- The source contains off-canvas poster layers in both the Events heading section and Poster Rail. Their existence is not an instruction to retain duplicate/out-of-bounds nodes. Rebuild the intended rail with the current scroll/overflow contract.
- Some source image slots have missing sources; others have remote URLs. All 19 are treated as non-reusable placeholders in the study copy.
- Crop/filter/transform declarations reflect the historical renderer. The placeholder study intentionally removes media effects while preserving frame geometry.
- App chrome is not part of the new page. The supplied screenshot and JSON have not been re-rendered or checked for pixel equivalence.

## A useful adaptation

For a Mahjong reservation page, borrow the event priority system and concise timeline: one featured session, what happens on arrival, game time and optional social time. Use current factual content and a brighter brand system. A poster placeholder should describe the intended artwork; it should not be mistaken for completed event creative.
