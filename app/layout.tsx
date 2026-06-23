import type { Metadata, Viewport } from "next";
import {
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Background } from "@/components/layout/Background";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { profile } from "@/lib/profile";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const { identity } = profile;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? identity.links.website;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${identity.name} — ${identity.title}`,
    template: `%s · ${identity.name}`,
  },
  description: identity.summary,
  applicationName: `${identity.name} — Portfolio`,
  authors: [{ name: identity.name, url: identity.links.linkedin }],
  creator: identity.name,
  keywords: [
    identity.name,
    "Technical Product Manager",
    "Product Owner",
    "QA Automation",
    "Release Quality",
    "CI/CD",
    "AI Product Manager",
    "SpecHawk",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: `${identity.name} — Portfolio`,
    title: `${identity.name} — ${identity.title}`,
    description: identity.heroSummary,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — ${identity.title}`,
    description: identity.heroSummary,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0F17" },
    { media: "(prefers-color-scheme: light)", color: "#F4F5F2" },
  ],
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: identity.title,
  description: identity.summary,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: identity.location,
  },
  email: identity.links.email,
  sameAs: [
    identity.links.linkedin,
    identity.links.github,
    identity.links.youtube,
  ],
  knowsAbout: profile.areasOfExpertise,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = `${inter.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`;
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Background />
          {children}
          <CustomCursor />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
