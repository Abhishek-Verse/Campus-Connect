import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/toaster";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--ff-display",
  style: ["normal", "italic"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--ff-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--ff-mono",
});

export const metadata: Metadata = {
  title: "CampusConnect · TCET — Thakur College of Engineering & Technology",
  description:
    "The central hub for TCET campus life — club events, fests, hackathons, QR check-ins and verified participation certificates.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} noise bg-paper font-sans text-ink antialiased`}
      >
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
