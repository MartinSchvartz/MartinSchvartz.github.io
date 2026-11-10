import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import { Interactions } from "@/components/Interactions";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://martinschvartz.github.io"),
  title: "Martin Schvartz · Senior Software Engineer",
  description:
    "Fullstack engineer in Buenos Aires. Go and Python backends, React and TypeScript frontends.",
  openGraph: {
    title: "Martin Schvartz",
    description: "Senior Software Engineer in Buenos Aires.",
    url: "/",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
};

// Runs before paint: restores the saved accent and enables reveal styles only when JS is on.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{var a=localStorage.getItem('accent');if(a)d.dataset.accent=a}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
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
