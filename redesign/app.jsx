// LCR link page — interactive cards with copy / share / QR actions + latest-media previews.
const { useState, useEffect, useRef, useCallback } = React;
const L = window.LCRLogos;

/* ---------- small UI icons ---------- */
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="11" height="11" rx="2.4" />
    <path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" />
    <path d="m8.3 10.7 7.4-4.3M8.3 13.3l7.4 4.3" />
  </svg>
);
const IconQr = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" />
    <rect x="3" y="14" width="7" height="7" rx="1.2" />
    <path d="M14 14h3v3M21 14v.01M21 21v-4M17 21h4M14 21v-3.5" strokeLinecap="round" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const Play = ({ lg }) => (
  <span className={"pv__play" + (lg ? " pv__play--lg" : "")}>
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.4v13.2L19 12 8 5.4Z" /></svg>
  </span>
);

/* ---------- data ----------
   Preview fields below are realistic PLACEHOLDERS. To make them live, implement
   hydrateLatest() (bottom of this file) — fetch each source's latest item from a
   backend/proxy (podcast RSS, YouTube RSS or Data API, Church Center API) and merge
   it into these objects. A static page cannot fetch them directly (CORS + API keys). */
const SITE = "https://lifechurchriverside.org";

const SERMON_PREVIEW = {
  type: "episode",
  title: "Rooted — Finding Stability in an Anxious Age",
  date: "May 25, 2026",
  duration: "41 min",
};

const SECTIONS = [
  {
    label: "Listen to the Sunday sermon",
    items: [
      { id: "spotify", logo: "Spotify", title: "Sunday Sermon Podcast", desc: "Listen on Spotify", url: "https://open.spotify.com/show/lifechurchriverside", preview: SERMON_PREVIEW },
      { id: "apple", logo: "ApplePodcasts", title: "Sunday Sermon Podcast", desc: "Listen on Apple Podcasts", url: "https://podcasts.apple.com/podcast/lifechurchriverside", preview: SERMON_PREVIEW },
    ],
  },
  {
    label: "Watch & follow",
    items: [
      {
        id: "youtube", logo: "YouTube", title: "YouTube", desc: "Watch services & messages",
        url: "https://youtube.com/@lifechurchriverside",
        preview: { type: "video", title: "Sunday Service — Rooted, Week 3", date: "1 week ago", duration: "1:12:08" },
      },
      { id: "facebook", logo: "Facebook", title: "Facebook", desc: "Follow for updates", url: "https://facebook.com/lifechurchriverside" },
      { id: "instagram", logo: "Instagram", title: "Instagram", desc: "Photos & stories", url: "https://instagram.com/lifechurchriverside" },
    ],
  },
  {
    label: "Support the ministry",
    items: [
      {
        id: "give", logo: "Give", title: "Give Online", desc: "Secure giving via Church Center",
        url: "https://lifechurchriverside.churchcenter.com/giving", featured: true,
        preview: { type: "giving", campaign: "2026 Building Fund", raised: 48250, goal: 75000 },
      },
    ],
  },
];

/* ---------- helpers ---------- */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta); resolve();
    } catch (e) { reject(e); }
  });
}
const money = (n) => "$" + n.toLocaleString("en-US");

/* ---------- preview panel ---------- */
function Preview({ p }) {
  if (!p) return null;

  if (p.type === "episode") {
    return (
      <div className="pv pv--episode">
        <div className="pv__art" aria-hidden="true"><Play /></div>
        <div className="pv__body">
          <span className="pv__eyebrow">Latest episode</span>
          <span className="pv__title pv__title--clamp">{p.title}</span>
          <span className="pv__meta">{p.date} &middot; {p.duration}</span>
        </div>
      </div>
    );
  }

  if (p.type === "video") {
    return (
      <div className="pv pv--video">
        <div className="pv__thumb" aria-hidden="true">
          <Play lg />
          <span className="pv__dur">{p.duration}</span>
        </div>
        <div className="pv__body">
          <span className="pv__eyebrow">Latest video</span>
          <span className="pv__title pv__title--clamp">{p.title}</span>
          <span className="pv__meta">{p.date}</span>
        </div>
      </div>
    );
  }

  if (p.type === "giving") {
    const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
    return (
      <div className="pv pv--giving">
        <div className="pv__giverow">
          <span className="pv__eyebrow pv__eyebrow--light">{p.campaign}</span>
          <span className="pv__pct">{pct}%</span>
        </div>
        <div className="pv__bar"><span style={{ width: pct + "%" }}></span></div>
        <div className="pv__giverow pv__givemeta">
          <span><strong>{money(p.raised)}</strong> raised</span>
          <span>of {money(p.goal)} goal</span>
        </div>
      </div>
    );
  }
  return null;
}

/* ---------- card ---------- */
function Card({ item, showPreview, onToast, onQr }) {
  const Logo = L[item.logo];
  const [copied, setCopied] = useState(false);
  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(e); };

  const doCopy = () => {
    copyText(item.url).then(() => {
      setCopied(true); onToast("Link copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    }).catch(() => onToast("Couldn't copy — long-press the link instead"));
  };

  const doShare = async () => {
    const data = { title: `LCR — ${item.title}`, text: item.desc, url: item.url };
    if (navigator.share) {
      try { await navigator.share(data); } catch (e) { /* dismissed */ }
    } else {
      copyText(item.url).then(() => onToast("Sharing not supported — link copied instead"));
    }
  };

  const hasPreview = showPreview && !!item.preview;

  return (
    <div className={"card" + (item.featured ? " card--featured" : "") + (hasPreview ? " card--haspv" : "")}>
      <a className="card__hit" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} — ${item.desc}`}></a>
      <div className="card__row">
        <span className="card__logo"><Logo /></span>
        <span className="card__meta">
          <span className="card__title">{item.title}</span>
          <span className="card__desc">{item.desc}</span>
        </span>
        <span className="card__right">
          <span className="card__actions">
            <button className="iconbtn" title="Copy link" aria-label={`Copy link to ${item.title}`} onClick={stop(doCopy)}>
              {copied ? <IconCheck /> : <IconCopy />}
            </button>
            <button className="iconbtn" title="Share" aria-label={`Share ${item.title}`} onClick={stop(doShare)}>
              <IconShare />
            </button>
            <button className="iconbtn" title="Show QR code" aria-label={`Show QR code for ${item.title}`} onClick={stop(() => onQr(item))}>
              <IconQr />
            </button>
          </span>
          <span className="card__ext"><IconArrow /></span>
        </span>
      </div>
      {hasPreview && <div className="card__preview"><Preview p={item.preview} /></div>}
    </div>
  );
}

/* ---------- QR modal ---------- */
function QrModal({ item, onClose, onToast }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!item) return;
    try {
      const qr = qrcode(0, "M");
      qr.addData(item.url); qr.make();
      setSrc(qr.createDataURL(8, 16));
    } catch (e) { setSrc(null); }
  }, [item]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close iconbtn" onClick={onClose} aria-label="Close"><IconClose /></button>
        <div className="modal__label">Scan to open</div>
        <div className="modal__title">{item.title}</div>
        <div className="qr">{src ? <img src={src} alt={`QR code for ${item.title}`} /> : <div className="qr__fallback">QR unavailable</div>}</div>
        <div className="modal__url">{item.url.replace(/^https?:\/\//, "")}</div>
        <div className="modal__btns">
          <button className="btn" onClick={() => copyText(item.url).then(() => onToast("Link copied to clipboard"))}>Copy link</button>
          {src && <a className="btn btn--ghost" href={src} download={`lcr-${item.id}-qr.gif`}>Download</a>}
        </div>
      </div>
    </div>
  );
}

/* ---------- app ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1C5C46",
  "logoStyle": "color",
  "cardStyle": "soft",
  "previews": true,
  "dark": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [toast, setToast] = useState(null);
  const [qrItem, setQrItem] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  return (
    <div
      className="page"
      data-theme={t.dark ? "dark" : "light"}
      data-logos={t.logoStyle}
      data-cards={t.cardStyle}
      style={{ "--accent": t.accent }}
    >
      <main className="wrap">
        <header className="head">
          <div className="mark"><span>LCR</span></div>
          <h1 className="brandname">LifeChurch <em>Riverside</em> Detroit</h1>
          <p className="tagline">Listen, watch, give, and connect with us.</p>
          <a className="visit" href={SITE} target="_blank" rel="noopener noreferrer">
            Visit our website <IconArrow />
          </a>
        </header>

        {SECTIONS.map((sec, i) => (
          <section className="section" key={i}>
            <h2 className="seclabel">{sec.label}</h2>
            <div className="cards">
              {sec.items.map((item) => (
                <Card key={item.id} item={item} showPreview={t.previews} onToast={showToast} onQr={setQrItem} />
              ))}
            </div>
          </section>
        ))}

        <footer className="foot">
          <span>LifeChurch Riverside</span>
          <span className="dot">&bull;</span>
          <span>Detroit, Michigan</span>
        </footer>
      </main>

      <QrModal item={qrItem} onClose={() => setQrItem(null)} onToast={showToast} />

      <div className={"toast" + (toast ? " toast--show" : "")} role="status" aria-live="polite">
        <IconCheck />{toast}
      </div>

      <TweaksPanel>
        <TweakSection label="Brand accent" />
        <TweakColor label="Accent color" value={t.accent}
          options={["#1C5C46", "#155E63", "#7A3B1E", "#2E3A52"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Style" />
        <TweakToggle label="Latest-media previews" value={t.previews} onChange={(v) => setTweak("previews", v)} />
        <TweakRadio label="Logos" value={t.logoStyle} options={["color", "mono"]} onChange={(v) => setTweak("logoStyle", v)} />
        <TweakRadio label="Cards" value={t.cardStyle} options={["soft", "outline"]} onChange={(v) => setTweak("cardStyle", v)} />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

/* ============================================================================
   LIVE DATA HOOK (production) — not active in this static prototype.
   Implement on a backend or build step, then patch the SECTIONS preview objects
   and re-render. Suggested sources (all server-side to avoid CORS / hide keys):

   • Sermon (Spotify & Apple both read the same podcast RSS):
       GET <podcast RSS feed>  → newest <item>: title, pubDate, <itunes:duration>
   • YouTube latest:
       GET https://www.youtube.com/feeds/videos.xml?channel_id=<CHANNEL_ID>
       (or YouTube Data API search?order=date) → newest entry: title, published,
       videoId → thumbnail https://img.youtube.com/vi/<videoId>/hqdefault.jpg
   • Giving:
       Church Center / Planning Center Giving API → campaign goal + raised total.

   Example shape to merge back in:
     async function hydrateLatest() {
       const data = await fetch('/api/lcr/latest').then(r => r.json());
       // data = { sermon:{title,date,duration,art}, youtube:{...}, giving:{...} }
       // setState / re-render with these values.
     }
   ============================================================================ */
