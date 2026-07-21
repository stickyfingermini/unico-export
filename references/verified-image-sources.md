# Verified Image Direct URLs

When a page needs network imagery, search for a real image that matches the current subject and use the image CDN direct URL. Never use an image-provider detail page as `src`. Before export, verify that the URL returns `HTTP 200` and a `Content-Type` beginning with `image/`.

The URLs below returned `HTTP 200` and `image/jpeg` on 2026-07-21. Use them only as subject-matched fallback assets. They are not permanent availability guarantees; verify them again before every use.

| Subject | Direct image URL | Source page |
| --- | --- | --- |
| Mahjong table | `https://images.unsplash.com/photo-1767169768227-79688439fb37?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/mahjong-tiles-arranged-on-a-table-yUaqsVKIHYE` |
| Friends walking outdoors | `https://images.unsplash.com/photo-1752650143267-57c2491f5ba2?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/friends-are-walking-and-smiling-together-outdoors-2VkUdNANwdA` |
| Mountain snowboarding | `https://images.unsplash.com/photo-1763674038996-c8bbad13b13b?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/snowboarder-on-a-snowy-mountain-with-trees-QJ0m_ix_xso` |
| Makeup service | `https://images.unsplash.com/photo-1560869683-94e483e13bb0?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/makeup-artist-applying-makeup-using-brush-on-woman-SaA37d9E6fU` |
| Friends dining together | `https://images.unsplash.com/photo-1771837602933-c1cc6293702b?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/friends-gathered-around-a-table-with-food-and-candles-YfidYnwtXok` |

## Usage Rules

1. Search online for a real image matching each page subject. Never draw, encode, or generate SVG; never use local assets, data/blob URLs, placeholders, or fabricated addresses.
2. Select only HTTP(S) raster-image direct URLs. Reject any path, query parameter, media type, or content that indicates SVG.
3. For Unsplash, use `images.unsplash.com` direct URLs. Never use `unsplash.com/photos/...` detail pages or the retired `source.unsplash.com` random-image endpoint.
4. Keep `auto=format&fit=crop&w=1200&q=80` when appropriate to control mobile payload size. Add crop parameters or adjust `objectPosition` only when the composition requires it.
5. Before writing IR, send a HEAD request or a small-image GET request to the final URL and verify its status and media type. If validation fails, search again; never emit an unavailable URL.
6. Preserve the source page for author, license, and subject verification, but never place that page URL in component `src`.
