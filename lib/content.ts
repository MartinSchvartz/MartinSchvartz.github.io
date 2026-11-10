export const profile = {
  name: "Martin Schvartz",
  role: "Senior Software Engineer",
  location: "Buenos Aires, Argentina",
  email: "martinschvartz@gmail.com",
  links: {
    github: "https://github.com/MartinSchvartz",
    linkedin: "https://www.linkedin.com/in/martinschvartz",
  },
};

export const intro = [
  "Since 2018 I've been building products end to end: distributed services in Go, interfaces in React and TypeScript, and everything in between that keeps them fast and boring to operate.",
  "Lately I've been working on AI agents, and the unglamorous parts that make them reliable: harnesses, evals and guardrails.",
];

export type FocusId = "agents" | "backend" | "frontend" | "reliability";

export type Focus = {
  id: FocusId;
  title: string;
  body: string;
  stack: string[];
};

export const focus: Focus[] = [
  {
    id: "agents",
    title: "AI agents",
    body: "Getting an LLM to do something once is easy. Getting it to do the right thing every day, on real data, is mostly engineering. I build the harness around the model: well-scoped tools and MCP servers, retrieval when it needs context it doesn't have, evals that catch regressions before users do, and guardrails for when it's wrong anyway.",
    stack: ["Tool calling", "MCP", "RAG", "LLM evals", "Prompt engineering", "Claude Code", "Cursor"],
  },
  {
    id: "backend",
    title: "Backend and distributed systems",
    body: "Go services on GCP and AWS, each with one clear job, talking through queues where it makes sense. I've built services that absorb traffic spikes of 100x normal load, split a tangled legacy service into one with distinct error types and targeted retries (70% fewer errors), and made search-heavy pages up to 5x faster by reworking data structures and OpenSearch queries.",
    stack: ["Go", "Python", "PostgreSQL", "OpenSearch", "SQS / SNS", "Docker", "GCP", "AWS"],
  },
  {
    id: "frontend",
    title: "Frontend at scale",
    body: "React and TypeScript for a lot of people: micro frontends and Server-Driven UI on a platform with 220M+ users, and a Chrome extension that has to live inside other companies' web pages without breaking them. At that scale small details count. Better address inputs and validation cut bad addresses by 6%, and failed deliveries with them.",
    stack: ["React", "TypeScript", "Micro frontends", "Server-Driven UI", "Chrome extensions", "Jest", "Cypress"],
  },
  {
    id: "reliability",
    title: "Reliability and tooling",
    body: "I like knowing something broke before anyone files a ticket. Better monitoring, alerting and infrastructure helped cut downtime by about 90% on one platform. Parallelizing a test pipeline took CI from about five minutes to under one, which changes how often people are willing to ship.",
    stack: ["Datadog", "PagerDuty", "New Relic", "Kibana", "WebdriverIO", "CI/CD"],
  },
];

export const about = {
  title: "About",
  body: "Based in Buenos Aires, working remotely with US teams. Spanish is my first language and I work in English every day. I'm also studying Computer Science at UTN.",
};

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  /** Values for <time dateTime>. */
  startISO: string;
  endISO?: string;
};

export const experience: Role[] = [
  { company: "FORM (GoSpotCheck)", title: "Senior Software Engineer", start: "Feb 2026", end: "Present", startISO: "2026-02" },
  { company: "Grux", title: "Staff Engineer", start: "Jan 2025", end: "Feb 2026", startISO: "2025-01", endISO: "2026-02" },
  { company: "MercadoLibre", title: "Senior Software Engineer", start: "Apr 2023", end: "Jan 2025", startISO: "2023-04", endISO: "2025-01" },
  { company: "Kovix", title: "Fullstack Developer", start: "Jun 2022", end: "Apr 2023", startISO: "2022-06", endISO: "2023-04" },
  { company: "Siran Soluciones", title: "Fullstack Developer", start: "Dec 2018", end: "Jun 2022", startISO: "2018-12", endISO: "2022-06" },
];
