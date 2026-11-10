"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import { PHASES, phaseForHour, topicById, topics, type Phase, type TopicId } from "./topics";
import styles from "./Play.module.css";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <p className={styles.status}>Setting up the desk…</p>,
});

const TZ = "America/Argentina/Buenos_Aires";

function useBuenosAiresClock() {
  const [now, setNow] = useState<{ label: string; hour: number } | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
    const hourFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hourCycle: "h23" });
    const tick = () => {
      const d = new Date();
      setNow({ label: fmt.format(d).toLowerCase(), hour: Number(hourFmt.format(d)) });
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Play() {
  const [selected, setSelected] = useState<TopicId | null>(null);
  const [hovered, setHovered] = useState<TopicId | null>(null);
  const [override, setOverride] = useState<Phase | null>(null);
  const [support, setSupport] = useState<"pending" | "ok" | "none">("pending");
  const [reduced, setReduced] = useState(false);
  const clock = useBuenosAiresClock();

  const livePhase = clock ? phaseForHour(clock.hour) : "day";
  const phase = override ?? livePhase;
  const topic = selected ? topicById[selected] : null;

  useEffect(() => {
    setSupport(hasWebGL() ? "ok" : "none");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cyclePhase = () => setOverride(PHASES[(PHASES.indexOf(phase) + 1) % PHASES.length]);

  return (
    <div className={styles.root} data-phase={phase} data-selected={Boolean(topic)}>
      <div className={styles.canvas} aria-hidden="true">
        {support === "ok" && (
          <Scene
            phase={phase}
            reduced={reduced}
            selected={selected}
            hovered={hovered}
            onHover={setHovered}
            onSelect={(id) => setSelected((current) => (current === id ? null : id))}
            onWindow={cyclePhase}
          />
        )}
      </div>

      {support === "none" && (
        <p className={styles.status}>
          This page needs WebGL, which your browser doesn&apos;t seem to support.{" "}
          <Link className="u-link" href="/">
            The plain version
          </Link>{" "}
          has everything.
        </p>
      )}

      <header className={styles.top}>
        <div>
          <Link href="/" className={styles.name}>
            {profile.name}
          </Link>
          <p className={styles.sub}>{profile.role}</p>
        </div>
        <Link className="u-link" href="/">
          Plain version
        </Link>
      </header>

      <nav className={styles.dock} aria-label="Things on the desk">
        <p className={styles.hint}>
          {clock ? (
            <>
              It&apos;s {clock.label} in Buenos Aires.
              {override && override !== livePhase && <> Showing {override} instead.</>}
            </>
          ) : (
            "Buenos Aires"
          )}{" "}
          <span className={styles.desktopOnly}>Click things on the desk, or the window.</span>
        </p>
        <ul className={styles.topics}>
          {topics.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={styles.topic}
                aria-pressed={selected === t.id}
                onClick={() => setSelected((current) => (current === t.id ? null : t.id))}
                onPointerEnter={() => setHovered(t.id)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(t.id)}
                onBlur={() => setHovered(null)}
              >
                {t.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <aside className={styles.panel} data-open={Boolean(topic)} aria-live="polite" aria-hidden={!topic}>
        {topic && (
          <div key={topic.id} className={styles.panelInner}>
            <p className={styles.object}>{topic.object}</p>
            <h1 className={styles.panelTitle}>{topic.title}</h1>
            <p>{topic.body}</p>
            {topic.stack && (
              <ul className={styles.stack}>
                {topic.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
            {topic.id === "about" && (
              <p className={styles.links}>
                <a className="u-link" href={`mailto:${profile.email}`}>
                  Email
                </a>
                <a className="u-link" href={profile.links.linkedin}>
                  LinkedIn
                </a>
                <a className="u-link" href={profile.links.github}>
                  GitHub
                </a>
              </p>
            )}
            <button type="button" className={styles.close} onClick={() => setSelected(null)}>
              Close <span aria-hidden="true">· Esc</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
