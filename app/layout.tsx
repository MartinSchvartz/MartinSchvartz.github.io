import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Interactions } from "@/components/Interactions";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://martinschvartz.github.io"),
  title: "Martin Schvartz · Senior Software Engineer",
  description:
    "Senior software engineer in Buenos Aires with 8+ years building products end to end: Mercado Libre, FORM, Go, React and AI agents.",
  openGraph: {
    title: "Martin Schvartz",
    description: "Senior Software Engineer in Buenos Aires.",
    url: "/",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f4f0",
};

// Runs before paint so reveal styles only apply when JS is on.
const boot = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
        <Interactions />
      </body>
    </html>
  );
}
