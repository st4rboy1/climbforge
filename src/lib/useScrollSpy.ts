import { useEffect, useState } from "react";

/* Scrollspy: returns the id of the section currently under the nav.
 * Scroll-based (not IntersectionObserver) so unlinked sections between
 * anchors (e.g. #results, #faq) keep the previous link highlighted instead
 * of flickering. The winner is the last section whose top has passed 35%
 * down the viewport. Near the very top (hero) it returns null. */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const key = ids.join(",");
    let frame = 0;

    const compute = () => {
      frame = 0;
      if (window.scrollY < 80) {
        setActive(null);
        return;
      }
      const line = window.scrollY + window.innerHeight * 0.35;
      // Winner = deepest section top above the line (by document position,
      // not list order — so nav order can never mis-highlight again).
      let current: string | null = null;
      let bestTop = -Infinity;
      for (const id of key.split(",")) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (top <= line && top >= bestTop) {
          bestTop = top;
          current = id;
        }
      }
      setActive(current);
    };

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
