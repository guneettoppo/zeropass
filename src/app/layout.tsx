import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import LightRays from "@/components/LightRays";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeropassdrive",
  description: "Your personal Drive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

      {/* Background */}
      <div className="fixed inset-0 -z-10">
          <LightRays className="w-full h-full" />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
          {children}
      </div>
        <Analytics />
      </body>
    </html>
  );
}
