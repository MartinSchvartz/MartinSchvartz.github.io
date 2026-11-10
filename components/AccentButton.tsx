"use client";

import { useState } from "react";
import { cycleAccent } from "@/lib/accent";
import styles from "./AccentButton.module.css";

export function AccentButton() {
  const [announce, setAnnounce] = useState("");
  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={() => setAnnounce(`Accent color: ${cycleAccent()}`)}
        aria-label="Change accent color (shortcut: k)"
        title="Change accent color"
      >
        press <kbd className={styles.kbd}>k</kbd>
      </button>
      <span className="visually-hidden" aria-live="polite">
        {announce}
      </span>
    </>
  );
}
