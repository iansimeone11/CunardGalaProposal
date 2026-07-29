(function () {
  "use strict";

  const views = document.querySelectorAll(".view");
  const tabs = document.querySelectorAll(".venue-tab");
  const validIds = new Set(Array.from(views).map(v => v.id));

  function showView(id, opts) {
    opts = opts || {};
    if (!validIds.has(id)) id = "hub";

    views.forEach(v => v.classList.toggle("is-active", v.id === id));
    tabs.forEach(t => t.classList.toggle("is-active", t.dataset.go === id));

    if (!opts.skipScroll) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (!opts.skipHash) {
      const hash = id === "hub" ? "" : "#" + id;
      history.replaceState(null, "", location.pathname + hash);
    }
    initReveals();
  }

  document.addEventListener("click", function (e) {
    const trigger = e.target.closest("[data-go]");
    if (!trigger) return;
    e.preventDefault();
    showView(trigger.dataset.go);
  });

  window.addEventListener("popstate", function () {
    const id = location.hash.replace("#", "") || "hub";
    showView(id, { skipHash: true });
  });

  // Scroll-reveal
  let observer;
  function initReveals() {
    const active = document.querySelector(".view.is-active");
    if (!active) return;
    const targets = active.querySelectorAll(".tl-card, .gallery figure, .menu-col, .stat, .contact-card, .point, .video-card");
    targets.forEach(el => el.classList.add("reveal"));

    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(el => observer.observe(el));
  }

  // Header background intensifies on scroll
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    header.style.background = window.scrollY > 40 ? "rgba(23,19,15,.92)" : "rgba(23,19,15,.72)";
  });

  // Init from hash on load
  const initial = location.hash.replace("#", "") || "hub";
  showView(initial, { skipScroll: true, skipHash: true });
})();
