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

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  /** ISO-ish values for <time dateTime>. */
  startISO: string;
  endISO?: string;
  location?: string;
  points: string[];
};

export const experience: Role[] = [
  {
    company: "FORM (GoSpotCheck)",
    title: "Senior Software Engineer",
    start: "Feb 2026",
    end: "Present",
    startISO: "2026-02",
    location: "Remote",
    points: [
      "Moved a legacy planogram service to a Go microservice and cut its error rate by 70%.",
      "Migrated our workflows from GCP Workflows to Temporal.",
      "Made PhotoWorks up to 5x faster for enterprise accounts.",
      "Built Go services that absorb 100x traffic spikes.",
    ],
  },
  {
    company: "Grux",
    title: "Staff Engineer",
    start: "Jan 2025",
    end: "Feb 2026",
    startISO: "2025-01",
    endISO: "2026-02",
    location: "Remote",
    points: [
      "Led a Chrome extension for workflow management, built with React and TypeScript.",
      "Led development of the distributed Go services behind the product.",
    ],
  },
  {
    company: "MercadoLibre",
    title: "Senior Software Engineer",
    start: "Apr 2023",
    end: "Jan 2025",
    startISO: "2023-04",
    endISO: "2025-01",
    points: [
      "Built React and TypeScript apps used by more than 220 million people.",
      "Worked on micro frontends and Server-Driven UI.",
      "Brought the bad address rate down by 6%.",
      "Cut CI time by 80%.",
    ],
  },
  {
    company: "Kovix, Siran Soluciones",
    title: "Fullstack Developer",
    start: "2018",
    end: "2023",
    startISO: "2018",
    endISO: "2023",
    points: ["Where I learned the trade, shipping across the stack."],
  },
];
