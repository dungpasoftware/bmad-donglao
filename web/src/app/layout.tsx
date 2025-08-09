import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { LanguageToggle } from "@/components/language-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bmad Donglao",
  description:
    "Guided flow shell using Next.js 15, React 19, TailwindCSS 4, and shadcn/ui. Default language: vi; optional: en.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>
          <header className="w-full flex justify-end p-4">
            <LanguageToggle />
          </header>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
