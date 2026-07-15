# Unico Visual Component IR Contract

Read this file before writing `unico-design-ir.json`. All components in this phase are children of a `free-box` section and use the standard positioning fields `x`, `y`, `w`, `h`, and optional `zIndex`.

## Contents

- Core types
- Extended visual types
  - img-text
  - video-player
  - countdown
  - tabs
  - accordion
  - map
  - rating
  - social-share
  - person-profile
  - inquiry-box
  - goods-list
  - coupon
  - navigation
  - brand-navbar
  - search
  - banner
  - store-information
  - discount-promotion
  - service-list
  - event-list
  - event-calendar
  - blog-list
- Constraints

## Core Types

The existing core types remain supported:

- `text`: `text`, typography, color and link fields
- `img`: `src`, radius and link fields
- `button`: `text`, colors, radius, padding and link fields
- `rectangle` / `circle`: background, border and link fields
- `rich-text`: `html`

## Extended Visual Types

### img-text

```json
{
  "type": "img-text",
  "items": [
    { "name": "Studio", "imgUrl": "https://example.com/studio.jpg", "href": "" }
  ],
  "fontSize": 16,
  "color": "#111111",
  "bgColor": "#ffffff",
  "radius": 16
}
```

### video-player

```json
{
  "type": "video-player",
  "url": "https://example.com/video.mp4",
  "bgColor": "#000000"
}
```

### countdown

```json
{
  "type": "countdown",
  "title": "Registration closes in",
  "targetDate": "2026-08-01",
  "bgColor": "#111827",
  "color": "#ffffff"
}
```

### tabs

Use one to five tabs. Each tab may contain the same supported visual child types.

```json
{
  "type": "tabs",
  "activeColor": "#2563eb",
  "tabs": [
    {
      "title": "Overview",
      "height": 240,
      "bgColor": "#ffffff",
      "children": []
    }
  ]
}
```

### accordion

```json
{
  "type": "accordion",
  "items": [
    { "title": "What is included?", "content": "A concise answer." }
  ],
  "bgColor": "#ffffff",
  "borderColor": "#e5e7eb",
  "activeColor": "#2563eb"
}
```

### map

```json
{
  "type": "map",
  "address": "Venue address",
  "embedUrl": "https://www.google.com/maps/embed?...",
  "linkUrl": "https://maps.google.com/..."
}
```

Only use a real embeddable map URL. If none is available, prefer a text address and button instead.

### rating

```json
{
  "type": "rating",
  "rating": "4.8",
  "reviewCount": "128",
  "color": "#f59e0b"
}
```

Do not invent ratings or review totals. Use this component only when the user or current project provides those values.

### social-share

```json
{
  "type": "social-share",
  "title": "Share this page",
  "showFacebook": true,
  "facebookUrl": "",
  "showTwitter": true,
  "twitterUrl": "",
  "showLinkedin": true,
  "linkedinUrl": "",
  "showWhatsapp": true,
  "whatsappUrl": "",
  "showEmail": true,
  "emailUrl": "",
  "buttonStyle": "rounded"
}
```

### person-profile

```json
{
  "type": "person-profile",
  "avatar": "https://example.com/avatar.jpg",
  "name": "Person name",
  "title": "Role",
  "bio": "Short biography",
  "email": "",
  "phone": "",
  "linkedin": "",
  "twitter": "",
  "website": "",
  "avatarSize": 120
}
```

Do not invent contact details. Omit or leave unknown values empty.

### inquiry-box

```json
{
  "type": "inquiry-box",
  "title": "Contact us",
  "nameLabel": "Name",
  "contactLabel": "Phone or email",
  "inquiryTitleLabel": "Subject",
  "contentLabel": "Message",
  "pictureLabel": "Picture (optional)",
  "submitButtonText": "Submit",
  "successMessage": "Your inquiry has been submitted.",
  "primaryColor": "#2563eb",
  "buttonColor": "#2563eb",
  "buttonTextColor": "#ffffff"
}
```

## Constraints

- Use stable unique component IDs.
- Keep `x + w <= 386` unless overflow is explicitly requested.
- Business components load their own runtime data. Leave `list`, `events`, `services`, and `blogContents` empty and configure only presentation, source mode, counts, and filters documented by the IR.
- `goods-list` and `discount-promotion` default to automatic/all-products data mode unless the user explicitly requests a selection mode.
- `brand-navbar` is a top-level component; the compiler removes it from section children and emits it before `free-box` sections.
- Existing canonical components must never be recreated through compact IR during an edit. Use `mode: "extend"` and include only new sections.
- Major fixed/business components should occupy dedicated sections. The compiler assigns a safe minimum section height when `height` is omitted.
- Do not generate empty `video-player` or image components merely as placeholders. If no usable media URL exists, omit the media component and retain explanatory text only when the user needs it.
- Do not invent URLs, ratings, contact details or dates presented as facts.
- Unknown component types are compilation errors and must be removed or replaced deliberately.
