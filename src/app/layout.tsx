// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdSlot from "./components/AdSlot";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Search Companies House - Company House - Company Check - Find Company Information - Company Compass UK",
  description:
    "Company Portal App - UK Company Information and Insights from Companies House, The Gazette and elsewhere - Insolvency News and Analysis - Company Compass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId="G-G3QMGDEF71" />
        <meta name="msvalidate.01" content="6F2D6D7E6622829F73D997615CEEA43D" />

        {/* Chart.js (used for any chart visualisation) */}
        <script
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"
        ></script>

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7212919066729459"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Ad Banner - scrolls away on scroll */}
        <div className="ad-banner">
          <div className="ad-wrapper">
          <ins className="adsbygoogle"
     style={{display:'block'}}
     data-ad-client="ca-pub-7212919066729459"
     data-ad-slot="6222216159"
     
     data-full-width-responsive="true"></ins>
          </div>
        </div>

        {/* ✅ Sticky Header appears below Ad and sticks on scroll */}
        <div className="sticky-header">
          <Header />
        </div>

        {/* Main content */}
        <main>{children}</main>

        <Footer />
        <Analytics />
        <SpeedInsights />
        <script async data-id="101492637" src="//static.getclicky.com/js"></script>
      </body>
    </html>
  );
}
