# lcrdetroit-links

Coming-soon placeholder + link hub for **LifeChurch Riverside Detroit**, served from `lcrdetroit.org`.

- `lcrdetroit.org` → coming-soon page (`index.html`)
- `lcrdetroit.org/links` → link hub (`links/index.html`)

Static HTML, no build step. Hosted on **GitHub Pages** under the `LCR-Detroit` org. No Vercel account required. This repo is intentionally separate from the main site (which a colleague is building in v0/Vercel under a different account) so the two can ship on independent timelines.

---

## Structure

```
.
├── index.html        # coming-soon → lcrdetroit.org
├── links/
│   └── index.html    # link hub → lcrdetroit.org/links
├── CNAME             # contains: lcrdetroit.org (do not delete — Pages reads this)
└── README.md
```

No framework, no package manager. Tailwind is not used; styles are inline. External runtime deps loaded in-browser: Google Fonts (Fraunces, Karla) and Iconify (`code.iconify.design`) for the icons.

---

## Deploy (GitHub Pages)

1. Create a **public** repo `lcrdetroit-links` in the `LCR-Detroit` org. (Free Pages requires a public repo. If the repo must be private, use Cloudflare Pages instead — same files, point it at the repo, set the custom domain there.)
2. Push these files to `main`.
3. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, Folder = `/ (root)`.
4. **Custom domain**: enter `lcrdetroit.org`. The `CNAME` file already sets this; the settings field triggers cert provisioning.
5. After DNS propagates, check **Enforce HTTPS**.

### DNS at the registrar for `lcrdetroit.org`

Apex `A` records → GitHub Pages, plus `AAAA` for IPv6, plus a `www` `CNAME`:

```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
AAAA  @     2606:50c0:8000::153
AAAA  @     2606:50c0:8001::153
AAAA  @     2606:50c0:8002::153
AAAA  @     2606:50c0:8003::153
CNAME www   lcr-detroit.github.io
```

> Confirm these IPs against GitHub's current "Managing a custom domain for your GitHub Pages site" docs before relying on them — published values can change.

### Verify

- `https://lcrdetroit.org` loads the coming-soon page.
- `https://lcrdetroit.org/links` loads the link hub and all six links open correctly.
- Padlock (HTTPS) shows on both.

---

## When the main site arrives

The colleague's site will own the apex domain at that point. Two clean paths, decide then:

- **Move hosting to the main-site Vercel.** Drop `links/index.html` into that project's `public/links/` (or recreate it as a route) so `lcrdetroit.org/links` keeps working. Retire this repo's apex; the coming-soon `index.html` gets replaced by the real homepage.
- **Keep this hub independent.** Move it to `links.lcrdetroit.org` (a subdomain) and have the main site link to it. This repo stays as-is.

Either way, `links/index.html` is fully self-contained, so it relocates without rework.

---

## Rebranding (defaults used)

Brand was not specified, so the pages ship with a warm, neutral system that's easy to swap:

- **Colors:** change the six CSS variables at the top of each file's `:root` block (`--bg`, `--ink`, `--accent`, etc.). Both files use the same tokens.
- **Logo:** currently a text monogram ("LCR"). To use a real logo, replace the `.logo` div per the inline comment in `links/index.html` (`<img class="logo" ...>`), and do the same in `index.html`. Drop the image file in the repo root.
- **Fonts:** Fraunces (display) + Karla (body), loaded from Google Fonts.
- **Coming-soon copy:** placeholder line ("We're building something new here..."). Edit in `index.html`. No service times / contact / email signup were added — add or leave out as you like.
