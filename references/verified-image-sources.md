> Use `asset-workflow.md` for reuse, parallel discovery, shared budgets and draft fallback. These rules apply to **sourced** assets (`sourceType: "sourced"`; absent sourceType also means sourced). Only explicit requests authorize AI generation under `generated-visuals.md`. Never invent CC0, an author or a stock-library source for a generated image.

# Verified Commercial-Use Image Sources

Use this reference for manual sourcing and evidence fields; small graphics share the same workflow. Local raster paths are not final `img.src` values. A working URL does not establish copyright permission. The compiler validates recorded `assetManifest` evidence. When the Gateway helper returns `status: verified`, its structured source metadata and cached HTTP/byte checks supply that evidence; do not repeat them manually without a concrete gap. Visually inspect relevance and consider source restrictions separately. Without the helper, perform the source-page and URL steps below before using a new image.

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
| `verifiedAt` | Date of the observed direct-URL/file check; do not advance the source-review date just because the URL was checked again |
| `metadataCheckedAt` | When available, the separate source-metadata review time; a newer URL check must retain this original time |
| `contentType` | Current response media type, such as `image/jpeg`, `image/png`, or `image/svg+xml` |
| `statusCode` | Must be `200` |

## License policy

Prefer Public Domain and CC0. CC BY and CC BY-SA are acceptable only when attribution is preserved. Provider-wide terms such as the current Unsplash, Pexels, or Pixabay license may be used only when the individual image is eligible under those terms and the source page does not contain an editorial-only or other restriction.

Reject CC BY-NC, any non-commercial or personal-use license, Editorial Only material, unknown licenses, inaccessible license pages, and assets with unresolved model, trademark, location, or publicity-rights concerns. Do not infer permission from a search snippet, a CDN hostname, or the absence of a copyright notice. When evidence is incomplete, leave the image out of IR and follow the bounded draft/required-image fallback in asset-workflow.md.

The provider name does not establish a license: verify the specific asset's creator, license tier, commercial-use permission, and attribution requirement. Never rename an unsupported provider license to one accepted by the compiler.

## URL verification

1. Search for a subject-matched image on an approved source.
2. Open the individual source page and confirm author, license, commercial-use permission, and any attribution requirement.
3. Use only the provider's direct HTTP(S) image-file URL in the IR. Never put a detail page in `src`. Raster files and standalone remote SVG files are allowed; do not use inline SVG, data/blob URLs, SVGZ, placeholder domains, or redirects that do not resolve to an image.
4. Send a HEAD request or a small GET request to the final URL and verify HTTP 200 and the actual `Content-Type: image/*`. A standalone SVG must return `image/svg+xml`; URL suffixes and query parameters alone do not prove its format.
5. Local paths and empty values are not valid final image sources. Gateway generated assets are valid when they have signed preview URLs and matching real generation records; Apply replaces temporary URLs with saved Media Asset URLs.
6. Record observed evidence in `assetManifest`. Cache source metadata and URL checks separately; `verifiedAt` records the file check, not a new source review. Use the helper's explicit freshness windows rather than rechecking every cache hit. For manual checks, reuse source evidence for at most seven days and URL checks for six hours unless source restrictions demand earlier refresh; stale source evidence must be reviewed before using a new asset.

For DND previews, use the verified original direct URL. Applying the preview may copy the file through the user's media backend and replace `directUrl` with the resulting storage URL. Preserve the original file as `originalUrl` and retain `sourcePage`, author, license and attribution. This copy is performed by DND after the user's apply action; do not upload or request storage credentials during the design turn. A page without image resources has no image-license verification work.

The compiler cannot prove external legal status. It rejects missing or contradictory recorded evidence. Structured provider metadata or a manual source review supplies provenance; neither guarantees that an image has no third-party rights issue.
