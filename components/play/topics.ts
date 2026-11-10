import { about, focus, type FocusId } from "@/lib/content";

export type TopicId = FocusId | "about";

export type Topic = {
  id: TopicId;
  title: string;
  /** Short name of the desk object, used in labels. */
  object: string;
  body: string;
  stack?: string[];
};

const objects: Record<TopicId, string> = {
  agents: "Robot",
  backend: "Server rack",
  frontend: "Monitor",
  reliability: "Wall dashboard",
  about: "Me",
};

export const topics: Topic[] = [
  ...focus.map((f) => ({ ...f, object: objects[f.id] })),
  { id: "about", title: about.title, object: objects.about, body: about.body },
];

export const topicById = Object.fromEntries(topics.map((t) => [t.id, t])) as Record<TopicId, Topic>;

export type Phase = "day" | "evening" | "night";

export const PHASES: Phase[] = ["day", "evening", "night"];

/** Lighting phase for an hour of the day in Buenos Aires. */
export function phaseForHour(hour: number): Phase {
  if (hour >= 8 && hour < 17) return "day";
  if ((hour >= 17 && hour < 20) || (hour >= 6 && hour < 8)) return "evening";
  return "night";
}
