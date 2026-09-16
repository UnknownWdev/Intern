import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from "@/components/StoreProvider";
import { Navbar } from "@/components/common/Navbar";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { ToastProvider } from "@/components/common/ToastProvider";
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
  title: "Mindful Notes Blog",
  description: "A modern Redux-powered blog built with Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <StoreProvider>
            <Navbar />
            {children}
            <ToastProvider />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
