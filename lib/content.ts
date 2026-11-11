export const profile = {
  name: "Martin Schvartz",
  role: "Senior Software Engineer",
  location: "Buenos Aires, Argentina",
  email: "hi@martinschvartz.com",
  links: {
    github: "https://github.com/MartinSchvartz",
    linkedin: "https://www.linkedin.com/in/martinschvartz",
  },
};

export const headline = "I build products end to end, from Go services to React interfaces, for millions of people.";

export const intro = [
  "8+ years shipping software at scale: four years at Mercado Libre on subscriptions and shipping, and now the retail platform that PepsiCo, AB InBev and Kroger use in their stores every day.",
  "Lately I've been working on AI agents, and the unglamorous parts that make them reliable: harnesses, evals and guardrails.",
];

/** Short facts shown as a row under the intro. */
export const stats = [
  { value: "8+", label: "years building products" },
  { value: "220M+", label: "users on platforms I've shipped to" },
  { value: "Remote", label: "with US teams, in English" },
  { value: "CS", label: "currently studying Computer Science" },
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
    body: "React and TypeScript for a lot of people: micro frontends and Server-Driven UI on a platform with 220M+ users, and a Chrome extension that has to live inside other companies' web pages without breaking them. At that scale small details count.",
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
  body: "Based in Buenos Aires, working remotely with US teams. Spanish is my first language and I work in English every day. I'm currently studying Computer Science.",
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
  { company: "FORM (GoSpotCheck)", title: "Senior Software Engineer", start: "2026", end: "Present", startISO: "2026" },
  { company: "Grux", title: "Staff Engineer", start: "2025", end: "2026", startISO: "2025", endISO: "2026" },
  { company: "Mercado Libre", title: "Senior Software Engineer", start: "2021", end: "2025", startISO: "2021", endISO: "2025" },
  { company: "Kovix", title: "Fullstack Developer", start: "2018", end: "2021", startISO: "2018", endISO: "2021" },
];
