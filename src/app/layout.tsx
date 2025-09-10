import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { SpeedInsights } from "@vercel/speed-insights/next"

import { GoogleTagManager } from '@next/third-parties/google'

import { Analytics } from "@vercel/analytics/next"

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
  description: "Company Portal App - UK Company Information and Insights from Companies House, The Gazette and elsewhere - Insolvency News and Analysis - Company Compass",
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
      <script async src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7212919066729459"
     crossOrigin="anonymous"></script>


      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
          <Header/>
        <br/>
    <br/>
        {children}
       
        <Footer/>
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
