/* =========================================================
   AC Aesthetic Group — motion system
   Lenis smooth scroll + Motion One scroll-driven animation.
   One easing language, every section responds to scroll.
   ========================================================= */

import {
  animate,
  scroll,
  inView,
  stagger,
  spring,
  hover,
  press,
} from "https://cdn.jsdelivr.net/npm/motion@12/+esm";

// Motion module resolved — tell the failsafe it doesn't need to reveal content.
window.__motionReady = true;

const q = (s, ctx = document) => ctx.querySelector(s);
const qa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(pointer: fine)").matches;

// One shared easing language.
const EASE = "circOut";
const springs = {
  smooth: { type: spring, stiffness: 200, damping: 26 },
  snappy: { type: spring, stiffness: 460, damping: 28 },
};

// map a sub-range of progress to 0..1 (for phased scrub scenes)
const clampMap = (p, inA, inB, outA = 0, outB = 1) => {
  if (inB === inA) return outA;
  const t = Math.min(1, Math.max(0, (p - inA) / (inB - inA)));
  return outA + (outB - outA) * t;
};

const setYear = () => {
  const el = q("#year");
  if (el) el.textContent = new Date().getFullYear();
};

// Write final stat values immediately (used on reduced-motion / no-count-up paths).
const setStatsFinal = () => {
  qa(".stat__num").forEach((el) => {
    const to = parseFloat(el.dataset.count || "0");
    const dec = parseInt(el.dataset.decimals || "0", 10);
    el.textContent = to.toFixed(dec) + (el.dataset.suffix || "");
  });
};

init();

function init() {
  setYear();

  // ---- Reduced motion: show everything, no smoothing, no scrub ----
  if (reduce) {
    document.documentElement.classList.add("no-motion");
    setStatsFinal();
    wireAnchors(null);
    wireMobileNav();
    return;
  }

  const lenis = startLenis();
  wireAnchors(lenis);
  wireNav(lenis);
  wireMobileNav();

  heroEntrance();
  heroScroll();
  marquee();
  manifesto();
  cards();
  goldScene();
  experience();
  reveals(); // generic + stagger groups
  microInteractions();
}

/* ---------------- Lenis smooth scroll ---------------- */
function startLenis() {
  if (!window.Lenis) return null;
  const lenis = new window.Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    smoothWheel: true,
  });
  window.lenis = lenis;
  // Single rAF loop drives Lenis; Motion's scroll() reads the same position.
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
}

/* ---------------- anchor links ---------------- */
function wireAnchors(lenis) {
  qa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = q(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.1 });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });
}

/* ---------------- nav solidify on scroll ---------------- */
function wireNav(lenis) {
  const nav = q("#nav");
  if (!nav) return;
  const set = (y) => nav.classList.toggle("is-scrolled", y > 40);
  if (lenis) {
    lenis.on("scroll", (e) => {
      const y =
        typeof e.animatedScroll === "number"
          ? e.animatedScroll
          : window.scrollY;
      set(y);
    });
  } else {
    window.addEventListener("scroll", () => set(window.scrollY), {
      passive: true,
    });
  }
  set(window.scrollY);
}

/* ---------------- mobile menu ---------------- */
function wireMobileNav() {
  const nav = q("#nav");
  const toggle = q("#navToggle");
  const menu = q("#mobileMenu");
  if (!nav || !toggle || !menu) return;
  const setOpen = (open) => {
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
  };
  toggle.addEventListener("click", () =>
    setOpen(!nav.classList.contains("menu-open")),
  );
  menu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("menu-open"))
      setOpen(false);
  });
}

/* ---------------- hero ---------------- */
function heroEntrance() {
  const els = qa(".hero__content > *");
  if (!els.length) return;
  animate(
    els,
    { opacity: [0, 1], y: [26, 0] },
    { duration: 0.9, delay: stagger(0.09), ease: EASE },
  );
}

function heroScroll() {
  const hero = q(".hero");
  if (!hero) return;
  const img = q(".hero__img");
  if (img) {
    scroll(
      animate(img, { scale: [1.05, 1.24], y: [0, 60] }, { ease: "linear" }),
      {
        target: hero,
        offset: ["start start", "end start"],
      },
    );
  }
  const content = q(".hero__content");
  if (content) {
    scroll(
      animate(content, { opacity: [1, 0], y: [0, -40] }, { ease: "linear" }),
      {
        target: hero,
        offset: ["start start", "end start"],
      },
    );
  }
}

/* ---------------- marquee ---------------- */
function marquee() {
  const track = q("#marquee");
  if (!track || !fine) return;
  track.innerHTML += track.innerHTML; // duplicate for a seamless -50% loop
  animate(
    track,
    { x: ["0%", "-50%"] },
    { duration: 34, ease: "linear", repeat: Infinity },
  );
}

/* ---------------- manifesto line reveal ---------------- */
function manifesto() {
  const section = q(".manifesto");
  if (!section) return;
  inView(
    section,
    () => {
      animate(
        section.querySelectorAll(".word-line"),
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.7, delay: stagger(0.12), ease: EASE },
      );
      return false;
    },
    { amount: 0.2 },
  );
}

/* ---------------- treatment cards stagger ---------------- */
function cards() {
  const grid = q("#treatment-cards");
  if (!grid) return;
  inView(
    grid,
    () => {
      animate(
        grid.children,
        { opacity: [0, 1], y: [30, 0] },
        { duration: 0.6, delay: stagger(0.08), ease: EASE },
      );
      return false;
    },
    { amount: 0.15 },
  );
}

/* ---------------- gold signature pinned scrub ---------------- */
function goldScene() {
  const scene = q(".gold-scene");
  if (!scene) return;
  const img = q(".gold-scene__media img", scene);
  const copy = q(".gold-scene__copy", scene);
  if (copy) {
    copy.style.opacity = "0";
    copy.style.transform = "translateY(40px)";
  }
  scroll(
    (p) => {
      if (img) img.style.transform = `scale(${(1.2 - p * 0.2).toFixed(4)})`;
      if (copy) {
        const cp = clampMap(p, 0.05, 0.4);
        const out = clampMap(p, 0.82, 1); // gently release near the end
        copy.style.opacity = String(cp * (1 - out * 0.85));
        copy.style.transform = `translateY(${((1 - cp) * 40).toFixed(2)}px)`;
      }
    },
    { target: scene, offset: ["start start", "end end"] },
  );
}

/* ---------------- experience: parallax media + count-up ---------------- */
function experience() {
  const section = q(".experience");
  if (!section) return;

  const img = q(".experience__media img", section);
  if (img) {
    scroll(animate(img, { y: [-26, 26] }, { ease: "linear" }), {
      target: section,
      offset: ["start end", "end start"],
    });
  }

  qa(".stat__num", section).forEach((el) => {
    const to = parseFloat(el.dataset.count || "0");
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    inView(
      el,
      () => {
        animate(0, to, {
          duration: 1.4,
          ease: "easeOut",
          onUpdate: (v) => {
            el.textContent = v.toFixed(dec) + suffix;
          },
        });
        return false;
      },
      { amount: 0.8 },
    );
  });
}

/* ---------------- generic reveals + stagger groups ---------------- */
function reveals() {
  // standalone reveal elements
  inView(
    ".reveal",
    ({ target }) => {
      animate(
        target,
        { opacity: [0, 1], y: [28, 0] },
        { duration: 0.7, ease: EASE },
      );
      target.classList.add("is-in");
      return false;
    },
    { amount: 0.2, margin: "0px 0px -8% 0px" },
  );

  // stagger groups (gallery, quotes, visit rows)
  qa(".stagger").forEach((group) => {
    inView(
      group,
      () => {
        animate(
          group.children,
          { opacity: [0, 1], y: [26, 0] },
          { duration: 0.6, delay: stagger(0.08), ease: EASE },
        );
        return false;
      },
      { amount: 0.15 },
    );
  });
}

/* ---------------- hover / press micro-interactions ---------------- */
function microInteractions() {
  if (!fine) return;

  hover(".card", (el) => {
    animate(el, { y: -6 }, springs.smooth);
    return () => animate(el, { y: 0 }, springs.smooth);
  });

  hover(".gallery__item", (el) => {
    animate(el, { scale: 1.015 }, springs.smooth);
    return () => animate(el, { scale: 1 }, springs.smooth);
  });

  press(".btn", (el) => {
    animate(el, { scale: 0.96 }, { duration: 0.1 });
    return () => animate(el, { scale: 1 }, springs.snappy);
  });
}
