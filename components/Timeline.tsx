"use client";

import { useEffect, useRef } from "react";
import type { Role } from "@/lib/content";
import styles from "./Timeline.module.css";

/**
 * The rail fills down to a "reading line" at 60% of the viewport height,
 * and each dot fills once that line has reached it.
 */
export function Timeline({ roles }: { roles: Role[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dots = Array.from(list.querySelectorAll<HTMLElement>("[data-dot]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const reached = window.innerHeight * 0.6 - rect.top;
      const progress = Math.min(1, Math.max(0, reached / rect.height));
      list.style.setProperty("--progress", String(reduced.matches ? 1 : progress));
      for (const dot of dots) {
        const dotY = dot.getBoundingClientRect().top + dot.offsetHeight / 2 - rect.top;
        dot.toggleAttribute("data-active", reached >= dotY);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <ol className={styles.list} ref={listRef}>
      {roles.map((role) => (
        <li key={role.company} className={styles.entry} data-reveal>
          <p className={styles.dates}>
            <time dateTime={role.startISO}>{role.start}</time>
            {" – "}
            {role.endISO ? <time dateTime={role.endISO}>{role.end}</time> : role.end}
          </p>
          <div className={styles.body}>
            <span className={styles.dot} data-dot aria-hidden="true" />
            <h3 className={styles.company}>{role.company}</h3>
            <p className={styles.meta}>{role.title}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
