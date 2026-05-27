import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "dipeluk - Dukungan Intensif Pendampingan dan Layanan Kesehatan Mental",
  description: "Platform pemantauan kesehatan mental dan kepatuhan pengobatan untuk pasien BPJS Indonesia.",
  manifest: "/manifest.json",
  keywords: ["kesehatan mental", "BPJS", "pengobatan", "mood tracker", "PHQ-9"],
};

export const viewport: Viewport = {
  themeColor: "#0052cc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-50", "font-sans", geist.variable)}>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          inter.variable,
          jakarta.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
