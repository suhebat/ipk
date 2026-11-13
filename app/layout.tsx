
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import TanStackProvider from "./providers";
import BackToTop from "@/components/BackToTop";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Indeks Pembangunan Kebudayaan (IPK) | Kementerian Kebudayaan RI",
  description: "Pengukuran resmi pembangunan kebudayaan Indonesia",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isDark = cookieStore.get("theme")?.value === "dark";

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable}${isDark ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased">
        <TanStackProvider>
          {children}
          <BackToTop />
        </TanStackProvider>
      </body>
    </html>
  );
}
