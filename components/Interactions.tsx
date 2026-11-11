"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Page-wide behavior: scroll reveals and a note for devtools readers. */
export function Interactions() {
  const pathname = usePathname();

  // The layout stays mounted across client-side navigation, so observe again on every route.
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    console.log(
      "%cHi there.%c\nSource: https://github.com/MartinSchvartz/MartinSchvartz.github.io",
      "font: 500 14px Georgia, serif",
      "font: 12px system-ui, sans-serif; color: gray",
    );
  }, []);

  return null;
}
