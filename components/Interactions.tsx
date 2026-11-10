"use client";

import { useEffect } from "react";
import { cycleAccent } from "@/lib/accent";

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

/** Page-wide behavior: scroll reveals, the "k" accent shortcut and a note for devtools readers. */
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

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "k" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;
      cycleAccent();
    };
    window.addEventListener("keydown", onKey);

    console.log(
      "%cHi there.%c\nYou found the console. The source is at https://github.com/MartinSchvartz/MartinSchvartz.github.io\nTry pressing k on the page.",
      "font: 500 14px Georgia, serif",
      "font: 12px system-ui, sans-serif; color: gray",
    );

    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
