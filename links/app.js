/* LCR links page — card actions (copy / share / QR) + toast.
   No framework, no build. Loaded from same origin; the only external
   dependency is the pinned `qrcode` global (qrcode-generator on jsDelivr). */
(function () {
  "use strict";

  // Icons that get injected by JS (the rest live in the HTML).
  var ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  /* ---------- toast ---------- */
  var toastEl = document.getElementById("toast");
  var toastMsg = toastEl.querySelector(".toast__msg");
  var toastTimer = null;
  function showToast(msg) {
    toastMsg.textContent = msg;
    toastEl.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("toast--show");
    }, 2400);
  }

  /* ---------- clipboard ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  /* ---------- "latest" embed drawers (lazy) ---------- */
  var EMBEDS = {
    spotify: {
      src: "https://open.spotify.com/embed/show/3BezLbBgs6LaCEWwaLZg4n",
      height: 152,
      title: "Spotify player — Sunday Sermon Podcast",
      allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
    },
    apple: {
      src: "https://embed.podcasts.apple.com/us/podcast/sunday-sermon-with-pastor-georgia-hill-lcr-detroit/id1883584385",
      height: 175,
      title: "Apple Podcasts player — Sunday Sermon Podcast",
      allow: "autoplay *; encrypted-media *; clipboard-write",
    },
    youtube: {
      src: "https://www.youtube-nocookie.com/embed/videoseries?list=UUVUvukSxWfIR2IjqYTIjRrQ",
      video: true,
      title: "YouTube player — LCR Detroit latest uploads",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    },
  };

  function buildEmbed(holder, key) {
    var cfg = EMBEDS[key];
    if (!cfg || !holder || holder.querySelector("iframe")) return;
    var f = document.createElement("iframe");
    f.src = cfg.src;
    f.title = cfg.title;
    f.loading = "lazy";
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.setAttribute("allow", cfg.allow);
    f.setAttribute("allowfullscreen", "");
    if (!cfg.video) f.style.height = cfg.height + "px";
    holder.appendChild(f);
  }

  function toggleDrawer(more) {
    var key = more.getAttribute("data-drawer");
    var drawer = document.getElementById("drawer-" + key);
    if (!drawer) return;
    var isOpen = more.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      drawer.hidden = true;
      more.setAttribute("aria-expanded", "false");
    } else {
      buildEmbed(drawer.querySelector(".embed"), key); // lazy — iframe only on first open
      drawer.hidden = false;
      more.setAttribute("aria-expanded", "true");
    }
  }

  /* ---------- card action buttons (event delegation) ---------- */
  document.addEventListener("click", function (e) {
    var more = e.target.closest(".card__more[data-drawer]");
    if (more) {
      toggleDrawer(more);
      return;
    }
    var btn = e.target.closest(".iconbtn[data-action]");
    if (!btn) return;
    // Buttons sit above the stretched card link — don't navigate.
    e.preventDefault();
    e.stopPropagation();

    var action = btn.getAttribute("data-action");
    var url = btn.getAttribute("data-url");

    if (action === "copy") {
      copyText(url)
        .then(function () {
          showToast("Link copied to clipboard");
          var original = btn.innerHTML;
          btn.innerHTML = ICON_CHECK;
          setTimeout(function () {
            btn.innerHTML = original;
          }, 1600);
        })
        .catch(function () {
          showToast("Couldn't copy — long-press the link instead");
        });
    } else if (action === "share") {
      var data = {
        title: "LCR — " + btn.getAttribute("data-title"),
        text: btn.getAttribute("data-desc"),
        url: url,
      };
      if (navigator.share) {
        navigator.share(data).catch(function () {
          /* user dismissed — ignore */
        });
      } else {
        copyText(url).then(function () {
          showToast("Sharing not supported — link copied instead");
        });
      }
    } else if (action === "qr") {
      openQr({
        url: url,
        title: btn.getAttribute("data-title"),
        id: btn.getAttribute("data-id"),
      });
    }
  });

  /* ---------- QR modal ---------- */
  var modal = null;
  var lastFocus = null;

  function onKey(e) {
    if (e.key === "Escape") closeQr();
  }

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
      try {
        var qr = qrcode(0, "M");
        qr.addData(item.url);
        qr.make();
        src = qr.createDataURL(8, 16);
      } catch (e) {
        src = null;
      }
    }

    modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML =
      '<div class="modal__card" role="dialog" aria-modal="true" aria-label="QR code">' +
      '<button class="modal__close iconbtn" type="button" aria-label="Close">' + ICON_CLOSE + "</button>" +
      '<div class="modal__label">Scan to open</div>' +
      '<div class="modal__title"></div>' +
      '<div class="qr">' +
      (src ? '<img alt="">' : '<div class="qr__fallback">QR unavailable</div>') +
      "</div>" +
      '<div class="modal__url"></div>' +
      '<div class="modal__btns">' +
      '<button class="btn" type="button" data-qr-copy>Copy link</button>' +
      (src ? '<a class="btn btn--ghost" data-qr-download>Download</a>' : "") +
      "</div>" +
      "</div>";

    // Fill text via textContent (never interpolate URLs into HTML).
    modal.querySelector(".modal__title").textContent = item.title;
    modal.querySelector(".modal__url").textContent = item.url.replace(/^https?:\/\//, "");
    if (src) {
      var img = modal.querySelector(".qr img");
      img.src = src;
      img.alt = "QR code for " + item.title;
      var dl = modal.querySelector("[data-qr-download]");
      dl.href = src;
      dl.setAttribute("download", "lcr-" + item.id + "-qr.gif");
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeQr();
    });
    modal.querySelector(".modal__close").addEventListener("click", closeQr);
    modal.querySelector("[data-qr-copy]").addEventListener("click", function () {
      copyText(item.url).then(function () {
        showToast("Link copied to clipboard");
      });
    });

    document.body.appendChild(modal);
    document.addEventListener("keydown", onKey);
    modal.querySelector(".modal__close").focus();
  }
})();
