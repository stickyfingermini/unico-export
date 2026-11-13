# Generated auxiliary visuals

Follow asset-workflow.md for explicit sourcing requests. For ordinary new pages and full redesigns, call the runtime's model-native image-generation capability for missing image slots after considering suitable user-supplied assets. This is image generation, not image search: do not invoke search-assets, browse stock sites, or retrieve catalog/Commons candidates for placeholder slots. The Gateway `generate-visual.mjs` helper is an image-generation adapter when available; it must generate a new image and must not search or return existing candidates. These are replacement-ready placeholders, not finished or authentic business imagery. If a brief requests a real/authentic or source-verified final image but does not explicitly ask the agent to search, generate a clearly temporary placeholder and report that the final-image requirement is still unmet. Do not generate when the user forbids AI imagery or explicitly asks to use supplied assets only. Honor later instructions to stop generating or use search.

For placeholder or explicitly requested generation, prefer simple illustrations or abstract visuals that serve the content. Keep authentic product and people photos authentic unless the user explicitly asks for a fictional interpretation.

Before each call, state the **purpose → page location → aspect ratio → style**. Generate at most **three visuals per turn**, prioritizing the hero or other image slots most important to the page. Make one call per selected slot and do not retry failures. A failed or unavailable generation must leave the original image slot in place as a solid-color rectangle with the same position and dimensions; never omit the image region. Zero calls is correct when suitable supplied assets already serve the page or AI generation is prohibited. Do not add decoration to fill a quota. Keep body copy, prices, dates and CTA labels as editable components. Generated text cannot carry key information.

Keep placeholder prompts short and image-focused. Prefer abstract, editorial or clearly illustrative visuals without words, logos, identifying people, specific business interiors or claims about real events. Do not present generated subjects as the user's actual venue, product or customers. The user can replace these images later.

## Gateway helper

When provided by the Gateway, invoke `node .agents/tools/generate-visual.mjs` with stdin JSON:

```json
{
  "requestId": "hero-paper-texture-1",
  "purpose": "Low contrast paper texture behind the hero, below editable text",
  "prompt": "Warm off-white paper grain, very subtle, no text or logo, flat seamless texture",
  "sizeIntent": "landscape",
  "transparent": false
}
```

`sizeIntent` is an intent, mapped only to sizes configured by the service operator. Transparency is sent only when the provider configuration enables the background parameter. The server chooses the model and holds the provider key. Never search for provider credentials or call the provider directly.

At most **three actual calls per turn**, including failures, with no retries. Reuse the same request ID and identical payload to retrieve an existing generated result; changing that payload with the same ID is a conflict. Default timeout is 180 seconds. Stopping the turn cancels generation. If the helper or native generation capability is unavailable, times out or fails, continue with the page's other design work while keeping every planned image area as a same-size editable solid-color rectangle; report the pending replacements. Do not use an empty `img.src`: the compiler requires verified image URLs, so use a `rectangle` until a generated image is available.

The returned object is the `assetManifest` entry. Copy it unchanged and use its `directUrl` in image fields:

```json
{
  "sourceType": "generated",
  "assetId": "gateway-issued-uuid",
  "directUrl": "https://gateway.example/generated-assets/...signed...",
  "contentType": "image/png",
  "width": 1024,
  "height": 1024,
  "format": "png",
  "byteLength": 12345,
  "contentHash": "gateway-issued-sha256",
  "generation": {
    "model": "configured-model",
    "requestId": "hero-paper-texture-1",
    "purpose": "Low contrast paper texture behind the hero, below editable text",
    "prompt": "The actual submitted prompt",
    "createdAt": "2026-10-26T00:00:00.000Z",
    "contentSummary": "Low contrast paper texture"
  }
}
```

This is a shape example, not usable evidence. Real records are checked against Gateway storage and ownership. Do not invent stock-library sources, authors, CC0 or other licenses. Sourced assets still follow verified-image-sources.md; absent sourceType means sourced.

Place generated visuals in supported image fields. For a background or texture, use an `img` below the editable text in z-order. Do not embed temporary generated URLs inside customCSS or rich-text HTML: Apply can replace supported image fields reliably, and rejects final pages retaining temporary links. Keep the corresponding rectangle placeholder until the generated asset has a valid manifest and supported URL; never drop the slot while generation or asset registration is pending.

## Preview and Apply

Generated PNG/JPEG/WebP files are stored outside the session workspace, with default 24-hour expiry. Signed URLs provide read-only previews; they remain usable after Gateway restart until expiry. Provider URL results are downloaded immediately. Do not download to the workspace or replace the Gateway URL with a local/data/blob URL.

Apply imports generated bytes through DND's existing upload and Media Asset registration flow, then replaces temporary URLs with permanent stored URLs before the canvas commit. Generation and Discard do not register Media Assets. Failed uploads/registration retain completed work for retry. Browser-cached provenance is retained with `originalUrl`; cross-device provenance synchronization is outside this release.

If optional generation fails, keep its image slot as an editable solid-color rectangle with the same dimensions and position, and report that it needs replacement. Never remove the image region because generation failed. If a key visual explicitly required by the user is missing, say the design is incomplete. A successful compile is not visual approval.
