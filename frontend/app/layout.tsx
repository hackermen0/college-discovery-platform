import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
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
  title: "College Discovery — Compare Colleges & Programs",
  description:
    "AI Signal helps students discover, compare, and save college program comparisons with data-driven insights and an integrated Q&A assistant.",
  keywords: ["college comparison", "education", "ai recommendations", "admissions"],
  openGraph: {
    title: "AI Signal — Compare Colleges & Programs",
    description:
      "Discover and compare colleges and programs with AI-powered insights. Ask questions, save comparisons, and make informed choices.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "AI Signal"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Signal — Compare Colleges & Programs",
    description:
      "Discover and compare colleges and programs with AI-powered insights. Ask questions, save comparisons, and make informed choices."
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden h-full antialiased`}
    >
      <body className="overflow-x-hidden min-h-screen w-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
