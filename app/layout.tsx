import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ukrainian Reborn • Вакансії",
  description: "Сучасна платформа вакансій для української спільноти. Відроджуємо можливості разом.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="theme-dark">
      <body className={`${inter.variable} antialiased bg-[#0a0a0a] text-[#f5f5f5]`}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}