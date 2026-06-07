**Version:** 1.0
**Last Updated:** 2026-06-06 UTC
**Audience:** Future Claude Code sessions on this repo

---

# DEVELOPMENT.md — lcrdetroit-links

Reference for picking up work on `lcrdetroit-links`. Read `CLAUDE.md` first for engagement posture; this file has the technical context.

---

## 1. Purpose & Scope

Coming-soon placeholder + single-page link hub for **LifeChurch Riverside Detroit**, served from `lcrdetroit.org`.

- `lcrdetroit.org` → `index.html` (coming-soon, routes visitors to `/links`)
- `lcrdetroit.org/links` → `links/index.html` (the link hub)

The hub collects the church's public channels in one place for use in social bios. Scope is deliberately narrow: static content, no app behavior, no backend.

This repo is separate from the main church website, which a colleague is building in v0/Vercel under a different account. They live in the same org (`LCR-Detroit`) but deploy independently. The separation is intentional — an apex domain can only point at one host, and a Pages static site and a Vercel Next app can't both own `lcrdetroit.org`. Keeping the hub standalone lets it go live now without waiting on the main site.

---

## 2. Architecture

Static HTML, no build step. Two self-contained pages, each with inline `<style>` and no shared component layer (there are only two pages — a build step would add failure modes for no real gain). External runtime deps loaded in-browser: Google Fonts (Fraunces display, Karla body) and Iconify (`code.iconify.design`, v2.1.0) for platform icons.

Hosted on **GitHub Pages**, `LCR-Detroit` org, public repo. Free Pages requires a public repo; the hub is public content so that's fine. (If the repo ever needs to be private, Cloudflare Pages serves the same files free — point it at the repo and set the custom domain there.)

```
.
├── index.html        # coming-soon → lcrdetroit.org
├── links/
│   └── index.html    # link hub → lcrdetroit.org/links
├── CNAME             # lcrdetroit.org (Pages reads this — do not delete)
├── CLAUDE.md
├── DEVELOPMENT.md    # this file
└── README.md         # public-facing repo intro
```

---

## 3. Deploy (GitHub Pages)

1. Push to `main`.
2. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, Folder = `/ (root)`. The `CNAME` file sets the custom domain automatically.
3. After DNS resolves, check **Enforce HTTPS** (can take up to 24h to become available).

### DNS at the registrar for `lcrdetroit.org`

Verified against GitHub's "Managing a custom domain" docs, 2026-06-06:

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

Gotchas from the docs:
- If the registrar auto-creates a default/parking record on `@`, remove it — extra apex records can block cert generation.
- If the domain has CAA records, at least one must allow `letsencrypt.org` or Pages can't issue the cert.
- GitHub recommends an apex + `www` pair; with both pointed correctly, Pages auto-redirects between them.

### Verify
- `https://lcrdetroit.org` loads coming-soon.
- `https://lcrdetroit.org/links` loads the hub; all six links open.
- HTTPS padlock on both.

---

## 4. When the main site arrives

The colleague's site will take the apex domain at that point. Two clean paths, decided then:

- **Move hosting to the main-site Vercel.** Drop `links/index.html` into that project's `public/links/` (or rebuild as a route) so `/links` keeps working; the coming-soon `index.html` is replaced by the real homepage. Retire this repo's apex.
- **Keep the hub independent.** Move it to `links.lcrdetroit.org` and have the main site link to it. This repo stays as-is.

Either way `links/index.html` is fully self-contained and relocates without rework.

---

## 5. Rebranding

Brand was a placeholder at build time (warm ivory, river-teal accent, Fraunces + Karla). To finalize:

- **Colors:** the six CSS variables in each file's `:root` (`--bg`, `--ink`, `--accent`, etc.). Both pages share the same token names.
- **Logo:** currently a text monogram ("LCR"). Replace the `.logo` div with an `<img>` per the inline comment in `links/index.html`, mirror in `index.html`, drop the image in repo root.
- **Coming-soon copy:** placeholder line in `index.html`. No service times / contact / email capture were added — add or leave out.
- **Podcast detail:** buttons name the show "Sunday Sermon with Pastor Georgia Hill" (pulled from the Apple Podcasts URL). Confirm it's current.

---

## 6. Current State

Built, not yet deployed. Repo not yet created in `LCR-Detroit`. Files ready: both pages, `CNAME`, context files. Next actions: create repo in org, push, enable Pages, set DNS, enforce HTTPS. Brand finalization (logo + colors) pending input from Niles.

---

## 7. Known Gotchas

- `CNAME` deletion breaks the domain. Pages rewrites it from the Settings → Pages custom-domain field, but don't remove it from the repo.
- Pages rebuild is ~1 min after push, slower than Vercel — wait before verifying.
- The two pages duplicate their `:root` tokens and header markup. Fine at two pages; if a third page appears, consider whether the duplication is still worth avoiding a build step.
