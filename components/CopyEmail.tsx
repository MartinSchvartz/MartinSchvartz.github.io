"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CopyEmail.module.css";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button type="button" className={styles.button} data-state={state} onClick={copy}>
      <span className={styles.labels}>
        <span className={styles.idle}>Copy email</span>
        <span className={styles.done} aria-hidden="true">
          <svg className={styles.check} viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {state === "failed" ? "Couldn't copy" : "Copied"}
        </span>
      </span>
      <span className="visually-hidden" aria-live="polite">
        {state === "copied" ? "Email copied to clipboard" : state === "failed" ? "Copy failed" : ""}
      </span>
    </button>
  );
}
