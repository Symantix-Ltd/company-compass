import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UK Company Profiles & Business Intelligence for KYC, Risk Management, Marketing &amp; Sales - Company Compass",
  description: "Company Compass UK provides enriched UK Business Information and Insights for Risk Management, Sales &amp; Marketing, and Company Information Research. Find the right business info today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <script async src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
          <Header/>
        <br/>
    <br/>
        {children}
       
        <Footer/>
      </body>
    </html>
  );
}
