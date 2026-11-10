import type { Client } from "@/components/ClientLogo";

export type ThumbId = "form" | "meliplus" | "address" | "delivery";

export type Project = {
  title: string;
  /** Short line above the title, e.g. the product's local name. */
  eyebrow?: string;
  description: string;
  stack: string[];
  thumb: ThumbId;
  href?: string;
  /** Link text; defaults to the URL's host. */
  linkLabel?: string;
};

export type Company = {
  name: string;
  years: string;
  summary: string;
  /** Well-known customers, shown as logos linking to their sites. */
  customers?: Client[];
  projects: Project[];
};

export const form: Company = {
  name: "FORM",
  years: "2026 – now",
  summary:
    "FORM (GoSpotCheck) is the platform field teams at some of the biggest consumer brands use to run their work in stores: tasks on a mobile app, shelf and cooler photos read by AI image recognition, and reports that tell a brand what's actually on the shelf. I'm a senior engineer on the team building it.",
  customers: [
    { name: "PepsiCo", href: "https://www.pepsico.com/", logo: "/logos/pepsico.svg" },
    { name: "AB InBev", href: "https://www.ab-inbev.com/", logo: "/logos/abinbev.svg" },
    { name: "Kroger", href: "https://www.kroger.com/", logo: "/logos/kroger.svg" },
    // No clean public logo file, so it's set as a wordmark.
    { name: "Flowers Foods", href: "https://www.flowersfoods.com/", color: "#c8102e" },
    { name: "Wendy's", href: "https://www.wendys.com/", logo: "/logos/wendys.svg" },
    { name: "H&M", href: "https://www2.hm.com/en_us/index.html", logo: "/logos/hm.svg" },
  ],
  projects: [
    {
      title: "Retail execution with AI image recognition",
      eyebrow: "GoSpotCheck by FORM",
      description:
        "A rep takes a photo of a shelf; the platform finds out-of-stocks, prices and planogram issues, and turns them into the next task for the team.",
      stack: ["Image recognition", "Workflows", "Mobile", "Analytics"],
      thumb: "form",
      href: "https://www.form.com/go/es-marca/",
      linkLabel: "form.com",
    },
  ],
};

export const meli: Company = {
  name: "Mercado Libre",
  years: "2021 – 2025",
  summary:
    "Latin America's largest e-commerce and fintech company. I worked on features that every buyer touches, on a platform with 220M+ users.",
  projects: [
    {
      title: "Meli+",
      eyebrow: "Subscription program",
      description:
        "Mercado Libre's subscription: free shipping, discounts and streaming in one monthly plan. I helped build it from the start. It launched in Mexico in 2023, then Brazil, Chile and Argentina.",
      stack: ["Subscriptions", "React", "Go", "Server-Driven UI"],
      thumb: "meliplus",
      href: "https://www.mercadolibre.com.ar/suscripciones/meli-plus",
      linkLabel: "See Meli+",
    },
    {
      title: "Better address input",
      eyebrow: "Checkout",
      description:
        "Reworked how buyers type and validate their address. Fewer typos and missing details meant 6% fewer bad addresses, and fewer packages that never arrive.",
      stack: ["React", "TypeScript", "Micro frontends", "Validation"],
      thumb: "address",
      href: "https://www.mercadolibre.com.ar/",
      linkLabel: "mercadolibre.com.ar",
    },
    {
      title: "Delivery Day",
      eyebrow: "Tu día de entregas",
      description:
        "Buyers pick one day of the week and their orders arrive together on that day. One predictable delivery for the buyer, fewer trips for the courier.",
      stack: ["Shipping", "Go", "React"],
      thumb: "delivery",
      href: "https://www.mercadolibre.com.ar/",
      linkLabel: "mercadolibre.com.ar",
    },
  ],
};
