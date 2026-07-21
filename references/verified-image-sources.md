# 已验证图片直链

当页面需要网络图片时，先搜索与当前主题匹配的真实图片，再使用图片 CDN 直链。禁止把图片站的详情页 URL 当作 `src`。导出前必须验证 URL 返回 `HTTP 200`，且 `Content-Type` 以 `image/` 开头。

以下地址于 2026-07-21 验证为 `HTTP 200` 和 `image/jpeg`，可作为主题匹配时的可靠后备素材。它们不是永久可用性承诺；每次实际使用前仍需重新验证。

| 场景 | 图片直链 | 来源页面 |
| --- | --- | --- |
| 麻将牌桌 | `https://images.unsplash.com/photo-1767169768227-79688439fb37?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/mahjong-tiles-arranged-on-a-table-yUaqsVKIHYE` |
| 朋友户外同行 | `https://images.unsplash.com/photo-1752650143267-57c2491f5ba2?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/friends-are-walking-and-smiling-together-outdoors-2VkUdNANwdA` |
| 雪山单板运动 | `https://images.unsplash.com/photo-1763674038996-c8bbad13b13b?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/snowboarder-on-a-snowy-mountain-with-trees-QJ0m_ix_xso` |
| 化妆造型服务 | `https://images.unsplash.com/photo-1560869683-94e483e13bb0?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/makeup-artist-applying-makeup-using-brush-on-woman-SaA37d9E6fU` |
| 朋友聚餐活动 | `https://images.unsplash.com/photo-1771837602933-c1cc6293702b?auto=format&fit=crop&w=1200&q=80` | `https://unsplash.com/photos/friends-gathered-around-a-table-with-food-and-candles-YfidYnwtXok` |

## 使用规则

1. 每次按页面主题在线搜索真实图片，不得自行绘制、编码或生成 SVG，也不得使用本地资产、data/blob URL、占位图或伪造地址。
2. 只选择 HTTP(S) 位图直链。路径、查询参数、媒体类型或内容表明为 SVG 时一律禁止。
3. Unsplash 必须使用 `images.unsplash.com` 直链，不得使用 `unsplash.com/photos/...` 详情页或已废弃的 `source.unsplash.com` 随机图接口。
4. 建议保留 `auto=format&fit=crop&w=1200&q=80`，以控制移动端图片大小；构图需要改变时再增加 `crop` 或调整 `objectPosition`。
5. 在写入 IR 前对最终 URL 发起 HEAD 或小尺寸 GET 请求，确认状态码和媒体类型。验证失败时重新搜索，不得继续输出不可用地址。
6. 保留来源页面以便核对作者、授权和素材语义，但来源页面不能写入组件 `src`。
