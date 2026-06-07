# CLAUDE.md — lcrdetroit-links

Engagement posture for Claude Code when working in this repo. See `DEVELOPMENT.md` at root for technical context (read it first on any new session).

---

## Repo identity

Coming-soon placeholder + link hub for **LifeChurch Riverside Detroit**, served from `lcrdetroit.org`.

- `lcrdetroit.org` → coming-soon (`index.html`)
- `lcrdetroit.org/links` → link hub (`links/index.html`)

Static HTML, no build step. Hosted on **GitHub Pages** under the `LCR-Detroit` org. Intentionally separate from the main site (a colleague is building that in v0/Vercel under a different account) so the two ship on independent timelines.

Public repo. Low blast radius.

---

## Autonomy level

**Direct-to-main, low ceremony.** No PRs, no feature branches. Commit, let Pages rebuild (~1 min), verify live at the relevant URL.

**Exception — coordinate before changing:**

- `CNAME` — deleting or editing it breaks the custom domain. Don't touch without intent.
- DNS records (at the registrar, not in this repo) — out of scope for code changes; flag to Niles, don't attempt.
- Anything that would change how `/links` is structured or where it lives — the relocation plan when the main site arrives is a decision for Niles, not a reflex (see DEVELOPMENT.md §"When the main site arrives").

---

## Commit conventions

Lowercase conventional prefixes, short and specific. `feat:` for new content/links, `fix:` for bugs, `docs:` for markdown, `chore:` for cleanup. Keep under ~70 chars.

---

## Testing bar before calling a change done

No build, no typecheck, no test suite. Verification is manual and live:

1. Commit and push to `main`.
2. Wait ~1 min for Pages to rebuild.
3. Open the affected URL and confirm it renders and every link opens correctly.
4. For any link URL change, click through to the destination — don't trust the href by eye.

Always give Niles a one-line smoke test before the change lands.

---

## When to stop and ask

- A change would touch `CNAME` or anything domain/DNS related.
- A change would add a build step, framework, or runtime dependency — this repo is deliberately static (see "Out of scope").
- The request is really about the main-site relocation (Pages → Vercel, or moving to a subdomain) — that's a Niles decision, kick it back.
- A request could be read multiple ways and the wrong read is non-trivial to reverse.

---

## Session note protocol

At the end of a substantive session, write a note to:

```
~/dev/niles-ai-management/tasks/notes/lcrdetroit-links/session-YYYY-MM-DD.md
```

Commit it separately from the code changes here (cross-repo commit, accepted tradeoff). Include live URLs, files touched, what changed, known issues, open items. Skip the note for trivial single-line edits.

---

## Out of scope in this repo

- No build step, bundler, or framework. The no-build constraint is deliberate — Pages serves the files as-is.
- No browser storage (`localStorage`/`sessionStorage`). If `/links` ever gets embedded as an iframe, storage breaks; keep state in-memory only.
- No new runtime dependencies beyond the current CDN set (Google Fonts, Iconify) without explicit direction.
- No env vars, no secrets, no serverless functions. This is flat static hosting.

---

## Context pointers

- **Technical/architectural context:** `DEVELOPMENT.md` at root.
- **Universal profile:** `~/dev/niles-ai-management/profile/profile-condensed.md`.
- **Sibling reference for static-site patterns:** `~/dev/nilesheron-web` (same static, no-build approach; note it deploys via Vercel, this repo via Pages).
