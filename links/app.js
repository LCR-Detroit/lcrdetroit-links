/* LCR links page — renders /links from config.json, then wires the
   copy / share / QR / drawer interactions. No framework, no build.
   The only external dependency is the pinned `qrcode` global (jsDelivr). */
(function () {
  "use strict";

  /* ---------- icon registry (inline SVG strings) ---------- */
  var ICON = {
    arrow:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    copy:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.4"/><path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2"/></svg>',
    share:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.7 7.4-4.3M8.3 13.3l7.4 4.3"/></svg>',
    qr:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><path d="M14 14h3v3M21 14v.01M21 21v-4M17 21h4M14 21v-3.5" stroke-linecap="round"/></svg>',
    chev:
      '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  /* ---------- brand logo registry (referenced by `logo` in config) ---------- */
  var LOGO = {
    spotify:
      '<svg viewBox="0 0 24 24" class="brand" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1DB954"/><g fill="none" stroke="#fff" stroke-linecap="round"><path stroke-width="2.3" d="M5.6 9.2c4.4-1.4 9-1 12.9 1.5"/><path stroke-width="1.95" d="M6.5 12.7c3.6-1.1 7.4-.8 10.6 1.2"/><path stroke-width="1.6" d="M7.3 15.9c2.8-.8 5.6-.6 8.1 1"/></g></svg>',
    apple:
      '<svg viewBox="0 0 24 24" class="brand" aria-hidden="true"><defs><linearGradient id="apg" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#D873E8"/><stop offset="1" stop-color="#7E29BE"/></linearGradient></defs><circle cx="12" cy="12" r="12" fill="url(#apg)"/><g fill="#fff"><circle cx="12" cy="8.4" r="2.5"/><path d="M9.55 13.05c-.62.5-1.02 1.24-1.02 2.06 0 1.62 1.55 2.74 3.47 2.74s3.47-1.12 3.47-2.74c0-.82-.4-1.56-1.02-2.06-.46-.37-1.05-.04-1.05.55v.02c0 .77-.62 1.39-1.4 1.39s-1.4-.62-1.4-1.39v-.02c0-.59-.59-.92-1.05-.55Z"/><path d="M12 18.7c-.7 0-1.27.16-1.27.92 0 .5.4 1.86.7 2.66.18.48.32.72.57.72s.39-.24.57-.72c.3-.8.7-2.16.7-2.66 0-.76-.57-.92-1.27-.92Z"/></g></svg>',
    youtube:
      '<svg viewBox="0 0 24 24" class="brand" aria-hidden="true"><rect x="0.5" y="4.2" width="23" height="15.6" rx="5" fill="#FF0000"/><path d="M10 8.6 16.2 12 10 15.4Z" fill="#fff"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" class="brand" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M14.9 7.7h-1.6c-.66 0-1.1.44-1.1 1.12v1.6h2.6l-.36 2.5h-2.24V20.6h-2.5v-7.08H7.6v-2.5h1.7V8.66c0-1.96 1.2-3.16 3.06-3.16h2.54Z"/></svg>',
    give:
      '<svg viewBox="0 0 24 24" class="glyph" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 14h2a2 2 0 1 0 0-4h-3.6a3 3 0 0 0-2.1.9L2 16"/><path d="m5 19 1.9-1.9a3 3 0 0 1 2.1-.9H13c1 0 1.9-.3 2.6-1l4-3.8a1.7 1.7 0 0 0-2.4-2.4l-3.6 3.3"/><path d="M18.3 7.7a1.9 1.9 0 0 0-2.7-2.7l-.6.6-.6-.6A1.9 1.9 0 1 0 11.7 7.7l2.7 2.7Z"/></svg>',
  };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  // Embed configs collected during render, keyed by card id; read lazily on open.
  var EMBEDS = {};

  /* ---------- render ---------- */
  function brandHtml(brand, accent) {
    if (!accent) return esc(brand);
    var i = brand.indexOf(accent);
    if (i < 0) return esc(brand);
    return esc(brand.slice(0, i)) + "<em>" + esc(accent) + "</em>" + esc(brand.slice(i + accent.length));
  }

  function actionBtn(kind, c) {
    var u = esc(c.url), t = esc(c.title), d = esc(c.desc || "");
    if (kind === "copy")
      return '<button class="iconbtn" type="button" data-action="copy" data-url="' + u +
        '" title="Copy link" aria-label="Copy link to ' + t + '">' + ICON.copy + "</button>";
    if (kind === "share")
      return '<button class="iconbtn" type="button" data-action="share" data-url="' + u +
        '" data-title="' + t + '" data-desc="' + d + '" title="Share" aria-label="Share ' + t + '">' + ICON.share + "</button>";
    return '<button class="iconbtn" type="button" data-action="qr" data-url="' + u +
      '" data-title="' + t + '" data-id="' + esc(c.id) + '" title="Show QR code" aria-label="Show QR code for ' + t + '">' + ICON.qr + "</button>";
  }

  function cardHtml(c) {
    var u = esc(c.url), t = esc(c.title), d = esc(c.desc || "");
    var aria = c.desc ? t + " — " + d : t;
    var logo = LOGO[c.logo] || "";
    var html =
      '<div class="card' + (c.featured ? " card--featured" : "") + '">' +
      '<div class="card__row">' +
      '<a class="card__hit" href="' + u + '" target="_blank" rel="noopener noreferrer" aria-label="' + aria + '"></a>' +
      '<span class="card__logo">' + logo + "</span>" +
      '<span class="card__meta"><span class="card__title">' + t + "</span>" +
      (c.desc ? '<span class="card__desc">' + d + "</span>" : "") + "</span>" +
      '<span class="card__right"><span class="card__actions">' +
      actionBtn("copy", c) + actionBtn("share", c) + actionBtn("qr", c) +
      '</span><span class="card__ext">' + ICON.arrow + "</span></span>" +
      "</div>";

    if (c.drawer && c.drawer.embedUrl) {
      var dr = c.drawer;
      EMBEDS[c.id] = { src: dr.embedUrl, height: dr.height || 0, video: dr.kind === "video", title: c.title + " player" };
      html +=
        '<button class="card__more" type="button" data-drawer="' + esc(c.id) +
        '" aria-expanded="false" aria-controls="drawer-' + esc(c.id) + '">' +
        ICON.chev + "<span>" + esc(dr.label || "Latest") + "</span></button>" +
        '<div class="card__drawer" id="drawer-' + esc(c.id) + '" hidden>' +
        '<div class="embed' + (dr.kind === "video" ? " embed--video" : "") + '" data-embed="' + esc(c.id) + '"></div>' +
        '<a class="drawer__open" href="' + esc(dr.openUrl || c.url) + '" target="_blank" rel="noopener noreferrer">' +
        esc(dr.openLabel || "Open") + " " + ICON.arrow + "</a></div>";
    }
    return html + "</div>";
  }

  function render(cfg) {
    EMBEDS = {};
    var h = cfg.header || {};
    var html =
      '<header class="head">' +
      '<div class="mark"><span>' + esc(h.monogram || "") + "</span></div>" +
      '<h1 class="brandname">' + brandHtml(h.brand || "", h.brandAccent) + "</h1>" +
      (h.tagline ? '<p class="tagline">' + esc(h.tagline) + "</p>" : "") +
      (h.website && h.website.url
        ? '<a class="visit" href="' + esc(h.website.url) + '" target="_blank" rel="noopener noreferrer">' +
          esc(h.website.label || "Visit our website") + " " + ICON.arrow + "</a>"
        : "") +
      "</header>";

    (cfg.sections || []).forEach(function (s) {
      html += '<section class="section"><h2 class="seclabel">' + esc(s.label || "") + '</h2><div class="cards">';
      (s.cards || []).forEach(function (c) { html += cardHtml(c); });
      html += "</div></section>";
    });

    if (cfg.footer) {
      html += '<footer class="foot"><span>' + esc(cfg.footer.left || "") +
        '</span><span class="dot">&bull;</span><span>' + esc(cfg.footer.right || "") + "</span></footer>";
    }

    document.getElementById("app").innerHTML = html;
  }

  /* ---------- toast ---------- */
  var toastEl = document.getElementById("toast");
  var toastMsg = toastEl.querySelector(".toast__msg");
  var toastTimer = null;
  function showToast(msg) {
    toastMsg.textContent = msg;
    toastEl.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("toast--show"); }, 2400);
  }

  /* ---------- clipboard ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.focus(); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta); resolve();
      } catch (e) { reject(e); }
    });
  }

  /* ---------- "latest" embed drawers (lazy) ---------- */
  function buildEmbed(holder, key) {
    var cfg = EMBEDS[key];
    if (!cfg || !holder || holder.querySelector("iframe")) return;
    var f = document.createElement("iframe");
    f.src = cfg.src;
    f.title = cfg.title || "Embedded player";
    f.loading = "lazy";
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.setAttribute("allow", cfg.video
      ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      : "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture");
    f.setAttribute("allowfullscreen", "");
    if (!cfg.video && cfg.height) f.style.height = cfg.height + "px";
    holder.appendChild(f);
  }

  function toggleDrawer(more) {
    var key = more.getAttribute("data-drawer");
    var drawer = document.getElementById("drawer-" + key);
    if (!drawer) return;
    if (more.getAttribute("aria-expanded") === "true") {
      drawer.hidden = true;
      more.setAttribute("aria-expanded", "false");
    } else {
      buildEmbed(drawer.querySelector(".embed"), key); // lazy — iframe only on first open
      drawer.hidden = false;
      more.setAttribute("aria-expanded", "true");
    }
  }

  /* ---------- delegated clicks: drawer toggles + card actions ---------- */
  document.addEventListener("click", function (e) {
    var more = e.target.closest(".card__more[data-drawer]");
    if (more) { toggleDrawer(more); return; }

    var btn = e.target.closest(".iconbtn[data-action]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    var action = btn.getAttribute("data-action");
    var url = btn.getAttribute("data-url");

    if (action === "copy") {
      copyText(url).then(function () {
        showToast("Link copied to clipboard");
        var original = btn.innerHTML;
        btn.innerHTML = ICON.check;
        setTimeout(function () { btn.innerHTML = original; }, 1600);
      }).catch(function () { showToast("Couldn't copy — long-press the link instead"); });
    } else if (action === "share") {
      var data = { title: "LCR — " + btn.getAttribute("data-title"), text: btn.getAttribute("data-desc"), url: url };
      if (navigator.share) {
        navigator.share(data).catch(function () {});
      } else {
        copyText(url).then(function () { showToast("Sharing not supported — link copied instead"); });
      }
    } else if (action === "qr") {
      openQr({ url: url, title: btn.getAttribute("data-title"), id: btn.getAttribute("data-id") });
    }
  });

  /* ---------- QR modal ---------- */
  var modal = null;
  var lastFocus = null;
  function onKey(e) { if (e.key === "Escape") closeQr(); }
  function closeQr() {
    if (!modal) return;
    modal.remove();
    modal = null;
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openQr(item) {
    closeQr();
    lastFocus = document.activeElement;
    var src = null;
    if (typeof qrcode === "function") {
      try { var qr = qrcode(0, "M"); qr.addData(item.url); qr.make(); src = qr.createDataURL(8, 16); }
      catch (e) { src = null; }
    }
    modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML =
      '<div class="modal__card" role="dialog" aria-modal="true" aria-label="QR code">' +
      '<button class="modal__close iconbtn" type="button" aria-label="Close">' + ICON.close + "</button>" +
      '<div class="modal__label">Scan to open</div>' +
      '<div class="modal__title"></div>' +
      '<div class="qr">' + (src ? '<img alt="">' : '<div class="qr__fallback">QR unavailable</div>') + "</div>" +
      '<div class="modal__url"></div>' +
      '<div class="modal__btns"><button class="btn" type="button" data-qr-copy>Copy link</button>' +
      (src ? '<a class="btn btn--ghost" data-qr-download>Download</a>' : "") + "</div></div>";

    modal.querySelector(".modal__title").textContent = item.title;
    modal.querySelector(".modal__url").textContent = item.url.replace(/^https?:\/\//, "");
    if (src) {
      var img = modal.querySelector(".qr img");
      img.src = src; img.alt = "QR code for " + item.title;
      var dl = modal.querySelector("[data-qr-download]");
      dl.href = src; dl.setAttribute("download", "lcr-" + item.id + "-qr.gif");
    }
    modal.addEventListener("click", function (e) { if (e.target === modal) closeQr(); });
    modal.querySelector(".modal__close").addEventListener("click", closeQr);
    modal.querySelector("[data-qr-copy]").addEventListener("click", function () {
      copyText(item.url).then(function () { showToast("Link copied to clipboard"); });
    });
    document.body.appendChild(modal);
    document.addEventListener("keydown", onKey);
    modal.querySelector(".modal__close").focus();
  }

  /* ---------- boot: load content, render ---------- */
  fetch("config.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(render)
    .catch(function () {
      document.getElementById("app").innerHTML =
        '<p class="foot">Couldn’t load the page — please refresh.</p>';
    });
})();
