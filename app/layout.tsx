import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Upju regulēšana Svētes baseinā | Ūdeņu kultūras",
  description:
    "Interaktīva karte par upju regulēšanu Svētes baseinā un Zemgales līdzenumā 20. gadsimtā. Projekts «Ūdeņu kultūras» (lzp-2023/1-0248).",
  openGraph: {
    title: "Upju regulēšana Svētes baseinā",
    description:
      "Vēsturiskā upju regulēšana Zemgales līdzenumā – Ūdeņu kultūras.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lv">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
