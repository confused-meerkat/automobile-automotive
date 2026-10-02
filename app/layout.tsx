import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted, so the build never depends on Google Fonts being reachable.
// If the main site already loads Poppins and Geist Mono, keep its setup and
// make sure it exposes the same two CSS variables.
const poppins = localFont({
  src: [
    { path: "./fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/poppins-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "./fonts/geist-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/geist-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gembaconcepts.com"),
  title: "Gemba Concepts",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${poppins.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
