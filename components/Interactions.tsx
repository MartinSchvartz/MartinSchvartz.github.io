"use client";

import { useEffect } from "react";

/** Page-wide behavior: scroll reveals and a note for devtools readers. */
export function Interactions() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    targets.forEach((el) => io.observe(el));

    console.log(
      "%cHi there.%c\nSource: https://github.com/MartinSchvartz/MartinSchvartz.github.io\nThere's a 3D version of this page at /play.",
      "font: 500 14px Georgia, serif",
      "font: 12px system-ui, sans-serif; color: gray",
    );

    return () => io.disconnect();
  }, []);

  return null;
}
