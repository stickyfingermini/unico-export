> Default to public-web search for additional assets after reusing appropriate supplied brand materials. These rules apply to **sourced** assets (`sourceType: "sourced"`; absent sourceType also means sourced). Only when the user explicitly requests AI image generation, use [generated-visuals.md](generated-visuals.md): the Gateway record replaces stock-source and license fields. Failed searches do not permit automatic generation. Never invent CC0, an author or a stock-library source for a generated image.

# Verified Commercial-Use Image Sources

Use this reference for photographic and other primary page images. Small optional graphics have a separate search workflow in `small-visual-assets.md`, but follow the same asset-specific rights and direct-file requirements. Local generated raster files are not valid final `img.src` values; explicitly requested Gateway generation uses its signed preview URL and real record under `generated-visuals.md`. For sourced assets, require current, explicit evidence that commercial use is permitted. A working image URL is not evidence of copyright permission. The compiler validates the evidence recorded in the IR `assetManifest`; the agent must still inspect the source page and verify the final direct URL before writing IR.

## Required asset manifest fields

Every final image must have one matching entry keyed by `directUrl`. Do not include an empty `src` or local path in the final IR; it cannot be compiled as a placeholder.

| Field | Requirement |
| --- | --- |
| `directUrl` | Final HTTP(S) raster-image or standalone SVG URL used in `src` or an image-bearing component |
| `sourcePage` | Separate HTTP(S) page containing the author and license evidence |
| `author` | Named author or an explicit public-domain attribution statement |
| `license` | Exact per-asset license name. The current compiler accepts `Public Domain`, `CC0`, `CC BY`, `CC BY-SA`, `Unsplash License`, `Pexels License`, or `Pixabay Content License`; other valid license names may be rejected until the compiler is deliberately updated. |
| `commercialUse` | Must be `true` |
| `attributionRequired` | Boolean reflecting the license |
| `attribution` | Required when `attributionRequired` is `true` |
| `verifiedAt` | Date when the source page and direct URL were checked |
| `contentType` | Current response media type, such as `image/jpeg`, `image/png`, or `image/svg+xml` |
| `statusCode` | Must be `200` |

## License policy

Prefer Public Domain and CC0. CC BY and CC BY-SA are acceptable only when attribution is preserved. Provider-wide terms such as the current Unsplash, Pexels, or Pixabay license may be used only when the individual image is eligible under those terms and the source page does not contain an editorial-only or other restriction.

Reject CC BY-NC, any non-commercial or personal-use license, Editorial Only material, unknown licenses, inaccessible license pages, and assets with unresolved model, trademark, location, or publicity-rights concerns. Do not infer permission from a search snippet, a CDN hostname, or the absence of a copyright notice. When evidence is incomplete, do not add the image to final IR; find a different source or report that export is blocked.

The provider name does not establish a license: verify the specific asset's creator, license tier, commercial-use permission, and attribution requirement. Never rename an unsupported provider license to one accepted by the compiler.

## URL verification

1. Search for a subject-matched image on an approved source.
2. Open the individual source page and confirm author, license, commercial-use permission, and any attribution requirement.
3. Use only the provider's direct HTTP(S) image-file URL in the IR. Never put a detail page in `src`. Raster files and standalone remote SVG files are allowed; do not use inline SVG, data/blob URLs, SVGZ, placeholder domains, or redirects that do not resolve to an image.
4. Send a HEAD request or a small GET request to the final URL and verify HTTP 200 and the actual `Content-Type: image/*`. A standalone SVG must return `image/svg+xml`; URL suffixes and query parameters alone do not prove its format.
5. Local paths and empty values are not valid final image sources. Gateway generated assets are valid when they have signed preview URLs and matching real generation records; Apply replaces temporary URLs with saved Media Asset URLs.
6. Record the evidence in `assetManifest` after the URL is manually resolved and before publishing. Recheck stale entries before reuse; `verifiedAt` is evidence of a check, not a permanent availability guarantee.

For DND previews, use the verified original direct URL. Applying the preview may copy the file through the user's media backend and replace `directUrl` with the resulting storage URL. Preserve the original file as `originalUrl` and retain `sourcePage`, author, license and attribution. This copy is performed by DND after the user's apply action; do not upload or request storage credentials during the design turn. A page without image resources has no image-license verification work.

The compiler cannot prove the external legal status of an image. It rejects missing or internally contradictory evidence, while source-page review remains a required agent action. This reduces risk but is not legal advice or a guarantee that an image has no third-party rights issue.
