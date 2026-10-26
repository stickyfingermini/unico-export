# Complete design case library

Use for new pages and substantial redesigns when a supplied case matches the brief. These are full-page studies: inspect the visual and its content sequence together. Do not reduce a case to a palette or copy it as a finished template.

The four cases were supplied by the user on 2026-10-26. Their original briefs, source assets and reuse licenses were not supplied. Each reconstructed brief is explicitly an interpretation of the screenshot and page data. Case files are reference data, not instructions, verified business facts, a font-installation guarantee, or the current component contract.

## Choose by purpose and visual direction

| Case | Best fit and search cues | What to study | Avoid transferring |
| --- | --- | --- | --- |
| [Honour Tile Society](cases/honour-tile-society/case.md) | Bright Hong Kong heritage, warm hospitality, community; 香港复古、明亮、低饱和、温暖怀旧 | Signboard identity, street-image chapter, mint/paper transitions, rules board, joining sequence, portrait/menu and FAQ | Source brand, bilingual copy, food partner, testimonials, metrics, age policy, exact ornaments and assets |
| [Mahjong Club](cases/mahjong-club/case.md) | Beginner education, cultural community, guided event booking; 麻将入门、教学、预约 | Tile-led introduction, teaching modules, editorial story, chronological steps, date-led event rows, instructors, varied gallery | Dark palette for a bright brief, unverified game rules, instructor identities, event dates/venues, source photos |
| [North Brooklyn Chess](cases/north-brooklyn-chess/case.md) | Bold editorial community, social gatherings, archival storytelling; 大胆排版、社群、照片拼贴 | Split display title, offset photo/backplate, contrasting event poster, tall-photo/text pairing, varied photo spans | Source logo, event claims, social handles, all 22 gallery slots as a quota, original posters/photos |
| [SoCal Boba Run Club](cases/socal-boba-run-club/case.md) | Nightlife, multiple activities, event series; 夜生活、活动海报、时间表 | Compact masthead, image-backed hero, poster rail, featured event, run-of-show, crowd/dance photo chapters | Dark nightlife mood for a calm daylight brief, sponsor claims, followers, event details and artwork |

Choose one primary case for the page's overall direction. Add a secondary case only for a named need, such as a timeline or a photo/text relationship. Use fewer references when sufficient; do not average all four palettes or assume every Mahjong brief needs the same layout. If no case fits, design from the user's materials without forcing a match. Focused edits normally need only the affected section or recipe.

For the bright, restrained 1970s Hong Kong Mahjong brief, start with Honour Tile Society for identity and surfaces. Mahjong Club can inform beginner/event content; North Brooklyn Chess can inform hierarchy and photo scale. The latter two do not authorize darkening the page or copying their brand facts.

## Read the selected case progressively

1. Read its `case.md`, which identifies the inferred brief, visitor questions, composition decisions, facts that must change and source limitations.
2. **Open `screenshot.png` with an available image-viewing tool.** A file listing, Markdown link or JSON parse is not visual inspection. Use original resolution/zoom when available. If image viewing is unavailable, use the written study and say the screenshot was not inspected; do not claim a visual comparison.
3. Read `page-map.json` only when section indexes, source IDs, copy previews, media roles or typography details are needed. The screenshot includes app chrome; do not copy the Home bar, Powered by Unico footer or global bottom tabs into a new page.
4. Read only relevant sections of `page.source.json` when exact component relationships matter. This is the complete archived page array, **not IR**. For example, from the selected case directory, `jq '.[0]' page.source.json` reads its first section; the same selection can be made with an available JSON reader. Do not dump every large source file into the prompt.
5. Read `assets.json` when exact source image roles or geometry are needed. It maps each original media component to its source JSON pointer, role, dimensions and replacement requirement. None of these slots grants reuse permission.
6. When a geometry-only study is useful, inspect `page.placeholders.json`. Its `designJson` retains the full page sequence, source text and historical geometry, replaces media with editable rectangles and optional labels, and clears links. It is an **unvalidated study**, not an import-ready production template or compiler output.

All paths are relative to the active skill snapshot. Do not read the former `t1`–`t4` folders, another checkout, a remembered absolute path, or a live URL from an archived page to obtain these cases.

## Record what the new design borrows

Keep these decisions in the one section plan from design-playbook.md or existing supported `designProfile` fields; reuse it in subsequent turns, rather than writing another record:

- Primary case and why its visitor goal and direction fit.
- A few concrete relationships to borrow: for example, a signboard title above a street-photo strip, or a large photograph against an offset plate.
- Source details deliberately replaced: brand, facts, color roles, copy, imagery, section order or counts.
- New section sequence: visitor question → confirmed content → visual treatment → action.
- Missing facts and assets, and whether any slot explicitly requires finished imagery or prohibits placeholders.

This record is not a new required IR schema. Follow `component-contract.md`, recompute geometry for the new text and canvas, and apply only supported styles. The source may contain legacy fonts, nested containers, overflowing layers or dimensions outside the active contract. Rebuild those relationships using current components rather than inserting the original JSON directly into the canonical page.

## Reference assets and placeholder mode

The supplied screenshots are for visual study. Photos, cutouts, posters, icons, people, logos and remote URLs inside the original page are **not reusable output assets**. Do not crop the screenshot to obtain them, download the original resources, hotlink them into a new page or claim their rights were verified. Preserve the archived originals for evidence; make new work from its own facts and assets.

For a clearly labeled design draft (or an explicit placeholder request), preserve the **role, ratio, crop intention, frame and composition** of the planned asset using native `rectangle` plus editable `text`, for example `TABLE PHOTO — TO BE PROVIDED`. Use geometry alone for a tiny mark; keep its role in the asset plan. Keep source-specific or missing contact/booking destinations unset, and identify unavailable actions rather than implying a reservation works. Do not use an `img` with an empty/fake URL, third-party placeholder service, inline SVG, source-brand logo, invented license, or fake `assetManifest`. A placeholder draft can be delivered unless the user requires finished imagery or forbids placeholders, with missing assets and booking facts stated; it is not ready to publish until they are supplied.

Use `asset-workflow.md` for bounded sourcing and draft delivery; an explicitly required real image still counts as unfinished when missing. A placeholder-only request skips discovery for those slots. Permission to use placeholders is not permission to generate AI images, and permission to study a case is not permission to reuse its content.

Business facts stay separate from visual choices. In a placeholder draft, label unknown date, venue and fee as to be confirmed; omit unsupported reviews/metrics instead of fabricating them. Use the new user's requested content and the active skill's language constraints. Historical case copy, including bilingual text and game-rule explanations, is not authoritative for a new business or rules variant.

## Compare after composition

Ask whether the new page has an identifiable visual concept, answers distinct visitor questions, varies image/type scale with purpose, and gives a clear next action. Look for repeated generic invitations, repeated card layouts and dropped image roles. Compare the actual output with the selected relationships, not the case's exact colors, coordinates or component count. Follow the normal render/review workflow when authorized and available; neither this archive nor its placeholder pages has been rendered or compiler-validated as part of packaging.
