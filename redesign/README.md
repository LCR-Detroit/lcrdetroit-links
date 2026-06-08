# Handoff: LCR LinkTree — LifeChurch Riverside Detroit

## Overview
A mobile-first "link-in-bio" page for **LifeChurch Riverside Detroit (LCR)**. It collects the
church's external links (sermon podcast on Spotify & Apple Podcasts, YouTube, Facebook,
Instagram, and online giving) into a single branded landing page. Each link is a tappable card
that opens the destination, and each card also exposes quick **Copy link**, **Share**, and
**QR code** actions so the church can easily distribute individual links.

Selected cards also show an **always-visible "latest media" preview** beneath the link row:
the latest sermon episode (under both Spotify and Apple Podcasts), the latest YouTube video,
and a giving-campaign progress bar (under Give Online). **These previews ship with realistic
placeholder data** — see "Latest-media previews & live data" below for how to wire them to real
feeds. A static page cannot fetch this data directly (cross-origin requests are blocked and the
platform APIs need keys), so live hydration must happen on a backend / build step.

## About the Design Files
The files in this bundle are **design references created in HTML/React (via in-browser Babel)** —
a working prototype showing the intended look and behavior. They are **not** meant to be shipped
as-is. The task is to **recreate this design in the target codebase's environment** using its
established patterns and libraries. If there is no existing app yet, pick an appropriate stack
(a single static HTML/CSS/vanilla-JS page is entirely sufficient for this — it has no backend
needs; a tiny React/Vite or Astro app is also fine).

The prototype uses React only for convenience; **nothing here requires React**. The whole thing
is a static page: structure + CSS + a little JS for clipboard/share/QR. Feel free to implement
it as plain HTML/CSS/JS.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all specified
below and present in the prototype. Recreate the UI pixel-accurately.

## Screens / Views
There is a single screen (a vertically scrolling page), centered in the viewport with a max
content width.

### Page container
- **Max content width:** 480px, horizontally centered (`margin: 0 auto`).
- **Page padding:** `48px 22px 40px`.
- **Background:** warm cream with a soft radial glow at the top:
  `radial-gradient(120% 60% at 50% -8%, #F3EFE6, transparent 60%), #EBE7DC`.
- Fully responsive down to ~320px (uses `clamp()` on the headline).

### 1. Header (centered, flex column)
- **LCR monogram mark:** 96×96px circle, background `#FCFBF7`, soft shadow
  (`0 2px 6px rgba(40,35,25,.07), 0 12px 30px rgba(40,35,25,.10)`). Inside: text "LCR" in the
  **serif** font, weight 600, 26px, letter-spacing `.04em`, color = accent green `#1C5C46`.
  Margin-bottom 26px.
- **Brand name:** `LifeChurch Riverside Detroit` — serif, weight 600,
  `font-size: clamp(20px, 5.7vw, 29px)`, line-height 1.2, letter-spacing `-.01em`, color `#211F1A`.
  **Kept on a single line** (`white-space: nowrap`). The middle word **"Riverside" is italic and
  green** (`#1C5C46`); the other words are ink. Margin-bottom 12px.
- **Tagline:** `Listen, watch, give, and connect with us.` — sans, 15.5px, color `#8E8779`.
- **Visit button:** `VISIT OUR WEBSITE ↗` — inline-flex, uppercase, 12px, weight 600,
  letter-spacing `.14em`, color = accent green, no underline, 13px arrow icon, margin-top 20px,
  `:hover { opacity: .65 }`. Links to the church website.

### 2. Link sections
Three labeled sections, each `margin-bottom: 26px`:

1. **"Listen to the Sunday sermon"** → Spotify card, Apple Podcasts card
2. **"Watch & follow"** → YouTube card, Facebook card, Instagram card
3. **"Support the ministry"** → Give Online card (featured style)

- **Section label:** uppercase, 11px, weight 700, letter-spacing `.13em`, color `#A29B8C`,
  margin `0 0 11px 4px`.
- **Card list:** `display:flex; flex-direction:column; gap:11px`.

### 3. Link card (the core component)
A horizontal row. The whole card is clickable to open the link; the action buttons sit on top.

Layout: `display:flex; align-items:center; gap:14px; padding:15px 16px`.
- **Background:** `#F5F2EB`, **border:** `1px solid rgba(31,29,24,.07)`, **radius:** 18px,
  **shadow:** `0 1px 2px rgba(40,35,25,.04), 0 6px 18px rgba(40,35,25,.05)`.
- **Hover:** `transform: translateY(-2px)`, elevated shadow
  (`0 2px 4px rgba(40,35,25,.06), 0 14px 32px rgba(40,35,25,.10)`), border tints toward accent.
  Transition `.16s ease` on transform/shadow/border.

Card structure (left → right):
1. **Logo** — 38×38px brand mark (see Assets). Brand logos have `border-radius: 9px`.
2. **Meta** (flex column, `flex:1`, `min-width:0`):
   - **Title** — sans, weight 700, 15.5px, color `#211F1A`, line-height 1.25.
   - **Description** — sans, 12.5px, color `#8E8779`, single line with ellipsis
     (`overflow:hidden; text-overflow:ellipsis; white-space:nowrap`).
3. **Right group** (`display:flex; align-items:center; gap:6px`):
   - **Actions** (`display:flex; gap:2px`) — three icon buttons: **Copy**, **Share**, **QR**.
   - **External arrow** (↗) — 17px, color `#8E8779` at `.7` opacity, `pointer-events:none`.

**Click target / "stretched link" pattern:** an absolutely-positioned `<a>` (`position:absolute;
inset:0; z-index:1`) covers the whole card and is the real link (`target="_blank"
rel="noopener noreferrer"`). The action buttons live at `z-index:2` so they're clickable above
the overlay; their handlers call `preventDefault()` + `stopPropagation()` so they don't trigger
navigation. Keep this pattern (it avoids nesting `<button>` inside `<a>`, which is invalid HTML).

**Icon buttons (`.iconbtn`):** 32×32px, transparent bg, color `#8E8779`, radius 9px, 16px icon.
`:hover { background: color-mix(in oklab, accent 12%, transparent); color: accent }`.
`:active { transform: scale(.9) }`. Visible focus ring (`2px solid accent`).

### 4. Featured "Give Online" card
Same layout as a normal card but visually elevated:
- **Background:** vertical gradient of the accent —
  `linear-gradient(180deg, color-mix(in oklab, accent 92%, #fff), color-mix(in oklab, accent 78%, #000 22%))`.
  (With the default accent this reads as a deep forest green.)
- **Title:** white. **Description:** `rgba(255,255,255,.74)`. **Arrow / giving glyph:** white.
- **Icon buttons:** `rgba(255,255,255,.78)`, hover background `rgba(255,255,255,.16)` → white.
- **Shadow:** accent-tinted (`0 2px 6px color-mix(in oklab, accent 30%, transparent),
  0 14px 30px color-mix(in oklab, accent 24%, transparent)`).

### 4b. Latest-media preview panel (inside selected cards)
When a card has preview data, a panel renders **below** the link row, separated by a 1px
top border (`var(--card-bd)`; on the featured card `rgba(255,255,255,.18)`). The card becomes a
flex **column**: `.card__row` (the link row described above) on top, `.card__preview`
(`padding:13px 16px 15px`) below. The whole-card stretched `<a>` still covers both, so tapping
the preview opens the same destination. Cards **without** preview data (Facebook, Instagram)
render just the row.

Shared preview type styles:
- **Eyebrow:** uppercase, 10px, weight 700, letter-spacing `.12em`, color `#A29B8C` (light variant
  `rgba(255,255,255,.72)` on the green card).
- **Title:** 13.5px, weight 600, ink, line-height 1.32, clamped to 2 lines.
- **Meta:** 12px, muted.
- **Play badge:** circle, `rgba(252,251,247,.94)` bg, dark glyph, soft shadow — 26px in episode
  art, 46px centered on video thumb.

Three preview variants:
1. **Episode** (Spotify, Apple) — eyebrow `LATEST EPISODE`. Horizontal: 52×52px rounded art
   placeholder (tonal gradient `linear-gradient(135deg,#d3ccba,#a59c83)` with a small play badge)
   + title + `{date} · {duration}`. *Both sermon cards show the same latest episode (it's the same
   podcast on two platforms).*
2. **Video** (YouTube) — eyebrow `LATEST VIDEO`. Full-width 16:9 thumbnail placeholder (tonal
   gradient) with a large centered play badge and a duration chip bottom-right
   (`rgba(20,18,12,.78)` bg, white, 11px, radius 5px), then title + date below.
3. **Giving** (Give card) — eyebrow = campaign name + right-aligned percentage (white, weight 700).
   A 7px rounded progress track (`rgba(255,255,255,.22)`) with a white fill (`width = pct%`,
   `transition: width .5s`), then a row: `**$X** raised` (left) / `of $Y goal` (right) in
   `rgba(255,255,255,.78)`, the raised figure white & bold.

The art/thumbnail gradients are **placeholders for real media artwork**. In production, replace
them with the real episode art / `https://img.youtube.com/vi/<id>/hqdefault.jpg` thumbnail.

### 5. Footer
`LifeChurch Riverside  •  Detroit, Michigan` — centered flex row, gap 10px, sans 13px,
color `#8E8779`, the bullet at `.6` opacity. Margin-top 40px.

## Interactions & Behavior
- **Card tap:** opens the link in a new tab.
- **Copy:** copies the link's URL to the clipboard. Uses `navigator.clipboard.writeText` when in
  a secure context, else falls back to a hidden `<textarea>` + `document.execCommand('copy')`.
  On success the copy icon swaps to a **checkmark** for ~1.6s and a toast appears.
- **Share:** uses `navigator.share({ title, text, url })` when available (mobile); otherwise falls
  back to copying the URL and showing a toast that explains sharing isn't supported.
- **QR:** opens a centered modal (see below) containing a QR code generated from the link's URL.
- **Toast:** fixed, bottom-center pill. Ink background (`#211F1A`), cream text, green checkmark
  icon, radius 12px. Slides up + fades in (`.22s ease`), auto-dismisses after 2.4s.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables animations/transitions.

### QR modal
- **Overlay:** fixed, full-screen, `rgba(28,24,16,.42)` with `backdrop-filter: blur(3px)`,
  centered, padding 24px. Click overlay or press **Escape** to close. Fade-in `.18s`.
- **Card:** max-width 320px, background `#F5F2EB`, radius 22px, padding `26px 24px 22px`,
  centered text, big drop shadow, pop-in animation (`.2s cubic-bezier(.2,.9,.3,1.2)`).
- **Contents:** close button (top-right), small uppercase label `SCAN TO OPEN`, the link's title
  in serif 20px, the **QR image** in a 188×188px white rounded box (`image-rendering:pixelated`),
  the URL (host + path, no scheme) in muted 12.5px, then two buttons:
  **Copy link** (solid accent) and **Download** (ghost — downloads the QR as a GIF).

## State Management
Minimal, all local UI state:
- `qrItem` — the link object whose QR modal is open (or null). Drives the modal.
- `toast` — current toast message string (or null) + a timeout to clear it.
- per-card `copied` boolean — to show the checkmark briefly.
- Tweak state (see Design Tokens → Theming) — only needed if you reproduce the tweak controls;
  **not required for production**. The production defaults are: accent `#1C5C46`, color logos,
  soft cards, light theme.

No data fetching. All link URLs are static config (see below).

## Latest-media previews & live data
The preview content lives in the `SECTIONS` config (`app.jsx`) as a `preview` object on each item:
```js
// episode (Spotify + Apple share one object)
{ type: "episode", title, date, duration }
// video (YouTube)
{ type: "video", title, date, duration }
// giving (Give)
{ type: "giving", campaign, raised, goal }   // pct is computed: round(raised/goal*100)
```
The shipped values are **realistic placeholders**. To make them live, fetch each source's latest
item **server-side** (to avoid CORS and to keep API keys secret) and merge the result into these
objects before render. Recommended sources:
- **Sermon (Spotify & Apple):** both platforms publish the same podcast, so read the podcast's
  **RSS feed** — newest `<item>` gives `title`, `pubDate`, `<itunes:duration>` and episode art.
- **YouTube:** `https://www.youtube.com/feeds/videos.xml?channel_id=<CHANNEL_ID>` (RSS, no key) or
  the YouTube Data API (`search?order=date`) — newest entry gives `title`, `published`, `videoId`;
  thumbnail = `https://img.youtube.com/vi/<videoId>/hqdefault.jpg` (this image URL is CORS-free and
  can be used client-side once you know the id).
- **Giving:** Church Center / Planning Center **Giving API** for campaign `goal` + `raised` totals.

A commented `hydrateLatest()` stub at the bottom of `app.jsx` sketches the integration: fetch a
single `/api/lcr/latest` endpoint your backend exposes, then re-render with the returned values.
Recommended cadence: cache the feed and refresh every 10–30 min (a Sunday-once cadence is fine
for sermons). Provide graceful fallback to the static copy if a feed is unavailable.

## Design Tokens
**Colors (light theme):**
- Accent (forest green): `#1C5C46`
- Page background: `#EBE7DC`; top glow: `#F3EFE6`
- Card background: `#F5F2EB`; card border: `rgba(31,29,24,.07)`
- Monogram circle: `#FCFBF7`
- Ink (primary text): `#211F1A`; soft ink: `#4C473D`
- Muted text: `#8E8779`; section label: `#A29B8C`

**Dark theme (optional, from the "Dark mode" tweak):**
- Background `#181611`, glow `#211E17`, card `#23201A`, card border `rgba(255,251,240,.08)`,
  monogram `#2C2820`, ink `#F1ECE1`, soft ink `#C8C1B2`, muted `#8E8779`, label `#7C7567`.

**Typography:**
- Serif (display / brand / monogram / modal title): **Spectral** (Google Fonts), weights
  400/500/600 + italic 500/600. Fallback `Georgia, serif`.
- Sans (body / labels / buttons): **Helvetica Neue**, Helvetica, system-ui, -apple-system, sans-serif.

**Spacing / radius / shadow:**
- Card radius 18px; modal radius 22px; icon-button & ghost-button radius 9–11px; toast 12px.
- Card gap 11px; section gap 26px.
- Card shadow `0 1px 2px rgba(40,35,25,.04), 0 6px 18px rgba(40,35,25,.05)`; hover shadow
  `0 2px 4px rgba(40,35,25,.06), 0 14px 32px rgba(40,35,25,.10)`.

**Theming variants** (exposed as "Tweaks" in the prototype — optional to port):
- Accent color options: `#1C5C46` (forest), `#155E63` (teal), `#7A3B1E` (terracotta), `#2E3A52` (slate).
- Logos: full color vs. monochrome (mono = CSS `filter: grayscale(1) ...` on the brand SVGs).
- Cards: soft (shadow) vs. outline (border, no shadow).
- Latest-media previews: on/off.
- Light vs. dark theme (`data-theme="dark"` on the page root).

## Link configuration (placeholder URLs — REPLACE with real ones)
```
Visit website:    https://lifechurchriverside.org
Spotify:          https://open.spotify.com/show/lifechurchriverside
Apple Podcasts:   https://podcasts.apple.com/podcast/lifechurchriverside
YouTube:          https://youtube.com/@lifechurchriverside
Facebook:         https://facebook.com/lifechurchriverside
Instagram:        https://instagram.com/lifechurchriverside
Give Online:      https://lifechurchriverside.churchcenter.com/giving
```

## Assets
- **Brand logos** are inline SVGs in `logos.jsx` (simplified marks used purely as link
  affordances): Spotify, Apple Podcasts, YouTube, Facebook, Instagram. Brand colors used:
  Spotify `#1DB954`, YouTube `#FF0000`, Facebook `#1877F2`, Apple Podcasts purple gradient
  (`#D873E8`→`#7E29BE`), Instagram gradient (`#FEDA75`→`#FA7E1E`→`#D62976`→`#962FBF`).
  You may swap these for the official brand SVGs / an icon library (e.g. Simple Icons) in
  production — just keep them at 38×38 with 9px radius.
- **Giving glyph** (on the Give card) and **Globe** are stroked line icons using `currentColor`
  (Lucide-style; the giving icon is the Lucide "hand-heart"). UI icons (copy, check, share, qr,
  arrow, close) are also small inline stroke SVGs in `app.jsx`.
- **QR generation:** the prototype uses the `qrcode-generator` npm package via CDN
  (`https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js`). In production, install
  `qrcode-generator` (or any QR library) from npm. Usage in the prototype:
  `const qr = qrcode(0, "M"); qr.addData(url); qr.make(); el.innerHTML = qr.createImgTag(...)`
  (the prototype uses `qr.createDataURL(8, 16)` for the `<img src>`).
- **Fonts:** Spectral from Google Fonts.

## Files
- `LifeChurch Riverside Links.html` — the page shell: all CSS (in a `<style>` block), font links,
  CDN script tags, and the mount point. **This is the source of truth for all styling.**
- `app.jsx` — React app: data config, the `Card` component (with the stretched-link + actions
  pattern), `QrModal`, toast, and the optional Tweaks panel wiring.
- `logos.jsx` — the brand/glyph SVG components.
- `tweaks-panel.jsx` — the prototype's in-page tweak controls (optional; **not needed for
  production** — included only so the design tokens above are adjustable in the demo).

To run the prototype as-is, serve the folder and open the HTML file (it needs network access for
the Google Fonts + CDN scripts).
