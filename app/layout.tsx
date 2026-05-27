import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "DIPELUK - Dukungan Kesehatan Mental",
  description: "Platform pemantauan kesehatan mental dan kepatuhan pengobatan.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={cn(
          "min-h-screen bg-[#f0f9ff] font-sans antialiased",
          inter.variable,
          jakarta.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}