# Bundled Design Optimization

Use this stage for a new page, a full redesign, or a recomposed section. Skip it for ordinary conversation and focused field-level patches. These rules are bundled with `unico-export`; do not invoke or wait for an external design Skill.

## 1. Extract the Brief

Identify only the inputs needed to make the page coherent:

- product, industry, audience, and use context;
- primary user action and content hierarchy;
- three to five tone words;
- supplied brand colors, assets, and constraints;
- content density and existing canvas traits that must remain consistent.
- for new pages, the Header's brand/wordmark, useful utility/navigation, purposeful action, height, and relationship to the Hero;
- two concrete composition techniques adapted from at least two of the supplied learning cases, including which source-specific details will be replaced.

Do not substitute a generic SaaS style when information is missing. Derive the visual language from the subject, audience, imagery, and conversion goal.

## 2. Select a Direction

Read `design-style-library.md` as a compact set of compositional options. Select one direction directly when the brief is clear. Compare multiple internal directions only when the brief is genuinely ambiguous; do not generate alternatives as a mandatory ceremony.

Record a concise `designProfile`:

```json
{
  "designProfile": {
    "source": "unico-export-bundled-rules",
    "query": "community events young professionals warm editorial mobile landing page",
    "direction": "Warm editorial community journal",
    "variationSeed": "community-journal-07",
    "styleFamily": "Editorial Magazine",
    "designResearch": {
      "tool": "unico-export-bundled-rules",
      "designSystemQuery": "community events young professionals warm editorial mobile landing page",
      "uxQuery": "visual hierarchy accessibility spacing consistency mobile ux",
      "styleReferences": ["Editorial Magazine"]
    },
    "theme": {
      "primary": "#c95f3d",
      "secondary": "#375a64",
      "accent": "#e6a23c",
      "background": "#f5efe6",
      "surface": "#fffaf2",
      "text": "#21141f",
      "muted": "#6f625d",
      "onPrimary": "#fffaf2",
      "onSurface": "#21141f",
      "border": "#d8c8b8"
    },
    "axes": {
      "layout": "asymmetric editorial stack",
      "palette": "warm paper, ink, and coral",
      "typography": "expressive display with restrained sans body",
      "imageRhythm": "one full-bleed hero followed by alternating crops",
      "surfaceTreatment": "paper fields with thin ruled dividers"
    }
  }
}
```

Create one semantic color theme before composing sections. Every explicit color in sections and components must reuse a theme value. Add a token first when a genuinely necessary color is missing.

## 3. Compose Efficiently

- Design the Header as real page content before laying out its children. Choose a compact wordmark and utility arrangement suited to the page; do not squeeze in desktop navigation or default to an unconsidered standard row.
- Communicate the page purpose and primary action in the first screen.
- Keep one dominant focal point per section.
- Storyboard each section's focal point, image role, density, and transition. Vary layout, type, imagery, surfaces, and spacing while keeping one coherent theme. Unless the brief clearly calls for a standard stack, use at least two structural moves such as scale contrast, an offset image, a broken grid, staggered crops, an edge bleed, a narrow text rail beside a large image, or intentional overlap.
- Vary image scale and aspect ratio to suit source material. Prefer a deliberate hero frame, asymmetric image pair, staggered gallery, or partially visible rail when it supports the story; do not default to equal thumbnails or identical cards.
- Complete an asset pass before locking the layout. Map useful visual roles (hero/background, featured photography, supporting images, icon, illustration, texture, ornament) to supplied assets, generated custom concepts, or verified licensed sources. Generate page-specific raster assets early when they fit the brief better than generic stock, but never generate lettering/logos into artwork or SVG. Generated local files remain staging concepts: final IR still requires a verified, commercially permitted direct HTTP(S) raster URL and the evidence required by `assetManifest`.
- Avoid repetitive floating cards, arbitrary gradients, glass effects, and pill shapes unless the brief calls for them.
- Keep touch actions at least 44px high where the component allows it.
- Keep body copy concise and normally 14–18px; reserve 12px for compact labels.
- Use a 4px or 8px spacing rhythm without making every gap identical.
- Prefer text, images, buttons, rectangles, and free boxes over specialized components.
- Never invent claims, statistics, testimonials, prices, dates, or business records.
- Give fixed business components a dedicated carrier section.

For repeated generations, vary at least three relevant axes from the previous known result when the brief permits it. A `variationSeed` records the chosen combination; it does not introduce uncontrolled randomness.

## 4. Media and Platform Constraints

- Preserve the 386px mobile canvas and the Unico component schema.
- Never generate, embed, or reference SVG imagery.
- Use only verified HTTP(S) raster images whose source page explicitly permits commercial use.
- Record each image and its evidence in `assetManifest`.
- Match image frames to source ratios and set crop focus and scale deliberately.
- Use registered component icon fields only when the component owns them.

## 5. Final Review

Before compilation, confirm that the direction relates to the specific product and audience, hierarchy and contrast are readable, each section has a clear focal point, image sources are verified, the component mix follows policy, and every visual choice maps to supported Unico fields.
