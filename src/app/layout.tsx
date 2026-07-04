/**
 * @file layout.tsx
 * @description Root layout with fonts, metadata, and global structure
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { createPageMetadata } from "@/lib/seo/metadata";
import { el } from "@/lib/i18n/messages/el";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek"],
  weight: ["300", "400", "500"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "greek"],
  weight: ["400", "500"],
});

export const metadata: Metadata = createPageMetadata({
  title: el.pages.home.metaTitle,
  description: el.pages.home.metaDescription,
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="AI site documentation" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI quick reference" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
