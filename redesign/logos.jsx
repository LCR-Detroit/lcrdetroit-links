// Brand + UI glyphs for the LCR link page.
// Brand logos are simplified marks used purely as link affordances (nominative use).
// Exported to window so app.jsx can reference them by name.

const Spotify = () => (
  <svg viewBox="0 0 24 24" className="brand" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#1DB954" />
    <g fill="none" stroke="#fff" strokeLinecap="round">
      <path strokeWidth="2.3" d="M5.6 9.2c4.4-1.4 9-1 12.9 1.5" />
      <path strokeWidth="1.95" d="M6.5 12.7c3.6-1.1 7.4-.8 10.6 1.2" />
      <path strokeWidth="1.6" d="M7.3 15.9c2.8-.8 5.6-.6 8.1 1" />
    </g>
  </svg>
);

const ApplePodcasts = () => (
  <svg viewBox="0 0 24 24" className="brand" aria-hidden="true">
    <defs>
      <linearGradient id="apg" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#D873E8" />
        <stop offset="1" stopColor="#7E29BE" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="12" fill="url(#apg)" />
    <g fill="#fff">
      <circle cx="12" cy="8.4" r="2.5" />
      <path d="M9.55 13.05c-.62.5-1.02 1.24-1.02 2.06 0 1.62 1.55 2.74 3.47 2.74s3.47-1.12 3.47-2.74c0-.82-.4-1.56-1.02-2.06-.46-.37-1.05-.04-1.05.55v.02c0 .77-.62 1.39-1.4 1.39s-1.4-.62-1.4-1.39v-.02c0-.59-.59-.92-1.05-.55Z" />
      <path d="M12 18.7c-.7 0-1.27.16-1.27.92 0 .5.4 1.86.7 2.66.18.48.32.72.57.72s.39-.24.57-.72c.3-.8.7-2.16.7-2.66 0-.76-.57-.92-1.27-.92Z" />
    </g>
  </svg>
);

const YouTube = () => (
  <svg viewBox="0 0 24 24" className="brand" aria-hidden="true">
    <rect x="0.5" y="4.2" width="23" height="15.6" rx="5" fill="#FF0000" />
    <path d="M10 8.6 16.2 12 10 15.4Z" fill="#fff" />
  </svg>
);

const Facebook = () => (
  <svg viewBox="0 0 24 24" className="brand" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path fill="#fff" d="M14.9 7.7h-1.6c-.66 0-1.1.44-1.1 1.12v1.6h2.6l-.36 2.5h-2.24V20.6h-2.5v-7.08H7.6v-2.5h1.7V8.66c0-1.96 1.2-3.16 3.06-3.16h2.54Z" />
  </svg>
);

const Instagram = () => (
  <svg viewBox="0 0 24 24" className="brand" aria-hidden="true">
    <defs>
      <linearGradient id="ig" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FEDA75" />
        <stop offset=".35" stopColor="#FA7E1E" />
        <stop offset=".6" stopColor="#D62976" />
        <stop offset="1" stopColor="#962FBF" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="24" height="24" rx="7" fill="url(#ig)" />
    <rect x="5" y="5" width="14" height="14" rx="4.4" fill="none" stroke="#fff" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.7" />
    <circle cx="16.4" cy="7.6" r="1.1" fill="#fff" />
  </svg>
);

// Give — "hand holding heart" (Lucide-derived, ISC). Uses currentColor.
const Give = () => (
  <svg viewBox="0 0 24 24" className="glyph" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 14h2a2 2 0 1 0 0-4h-3.6a3 3 0 0 0-2.1.9L2 16" />
    <path d="m5 19 1.9-1.9a3 3 0 0 1 2.1-.9H13c1 0 1.9-.3 2.6-1l4-3.8a1.7 1.7 0 0 0-2.4-2.4l-3.6 3.3" />
    <path d="M18.3 7.7a1.9 1.9 0 0 0-2.7-2.7l-.6.6-.6-.6A1.9 1.9 0 1 0 11.7 7.7l2.7 2.7Z" />
  </svg>
);

const Globe = () => (
  <svg viewBox="0 0 24 24" className="glyph" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </svg>
);

window.LCRLogos = { Spotify, ApplePodcasts, YouTube, Facebook, Instagram, Give, Globe };
