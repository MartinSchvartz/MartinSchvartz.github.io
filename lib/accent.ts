export const ACCENTS = ["ink", "clay", "moss"] as const;
export type Accent = (typeof ACCENTS)[number];

export function cycleAccent(): Accent {
  const root = document.documentElement;
  const current = (root.dataset.accent as Accent | undefined) ?? "ink";
  const next = ACCENTS[(ACCENTS.indexOf(current) + 1) % ACCENTS.length];
  if (next === "ink") delete root.dataset.accent;
  else root.dataset.accent = next;
  try {
    localStorage.setItem("accent", next);
  } catch {}
  return next;
}
