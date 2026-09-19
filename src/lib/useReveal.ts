import { useEffect } from "react";

/* Scroll-reveal: IntersectionObserver adds .is-visible once.
 * CSS .reveal handles the fade-slide + stagger via --reveal-delay.
 * Falls back to visible when IO is missing or reduced-motion is set. */
export function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function scrollToTop(event?: { preventDefault?: () => void }) {
  event?.preventDefault?.();
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = document.getElementById("top");
  try {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  } catch {
    /* ignore — history API unavailable (e.g. sandboxed iframe) */
  }
  if (target) {
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    // Move keyboard focus to the hero heading for screen-reader users.
    window.setTimeout(() => {
      const heading = target.querySelector("h1");
      if (heading instanceof HTMLElement) {
        if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }, reduce ? 0 : 450);
  } else {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }
}
