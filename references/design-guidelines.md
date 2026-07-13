# Unico Design Guidelines

## Prompt Revision

`visual-components-v2`

Change this revision label whenever an experiment materially changes the design direction. Include the active revision in the IR `message` so generated outputs can be compared later.

## Design Objective

Create a deliberate, production-oriented mobile page rather than a generic component demo. Translate the user's brief into a clear visual concept, content hierarchy, section rhythm, and conversion path before writing the IR.

## Current Tuning Profile

- Visual density: balanced
- Visual contrast: strong but controlled
- Section count: usually 4 to 7
- Corner treatment: mixed; do not round every container
- Card usage: only when grouping genuinely benefits comprehension
- Imagery: prefer one or two strong focal images over repeated small placeholders
- Typography: expressive display hierarchy with highly readable body copy
- Copy: concise, specific, and appropriate to the user's requested language
- CTA strategy: one clear primary action, with secondary actions only when useful

These values are the main experiment controls. Edit them first when comparing outputs.

## Composition Rules

- Make the first screen communicate the brand, offer, event, or purpose immediately.
- Establish one dominant focal point per section.
- Vary section composition and background treatment to create rhythm; avoid stacking visually identical white cards.
- Use spacing intentionally. Prefer a few confident groups over many small disconnected elements.
- Keep primary content inside the 386px canvas and respect safe side margins.
- Use rectangles, color fields, dividers, typography, and imagery to create depth without relying on unsupported effects.

## Visual Quality Rules

- Choose colors, typography, spacing, hierarchy, and CTA placement as one coherent system.
- Prefer a recognizable visual direction that fits the brief instead of defaulting to generic SaaS styling.
- Avoid unnecessary purple gradients, excessive glow, emoji decoration, pill-shaped everything, and repetitive floating cards unless the user requests that style.
- Do not invent awards, testimonials, statistics, prices, dates, or business claims. Use honest placeholders when information is missing.
- Use realistic image URLs or existing project assets when available. Do not add an image component with an empty source solely as decoration.
- Do not reproduce DOM structure mechanically. Build the intended editable Unico page structure.

## Content and Conversion Rules

- Preserve the language requested by the user; otherwise follow the language of the brief.
- Write concrete headings and CTA labels rather than generic filler such as “Welcome” or “Learn More” when a more specific action is possible.
- Keep body copy short enough for a mobile composition.
- Ensure the section order tells a coherent story and leads naturally toward the primary action.

## Experiment Notes

Use this section for temporary prompt experiments. Remove obsolete instructions instead of accumulating contradictory rules.

- No active experiment beyond `baseline-v1`.
