import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MME — Moment Marketing Engine",
    template: "%s | MME",
  },
  description:
    "AI-powered moment marketing for radio and social media. Detect real-world moments, generate matched content, and distribute across FM/DAB broadcast and social platforms in real-time.",
  openGraph: {
    title: "MME — Moment Marketing Engine",
    description:
      "AI-powered moment marketing for radio and social media. Detect moments, generate content, distribute in real-time.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-text">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
