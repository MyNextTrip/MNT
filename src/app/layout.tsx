import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://mynexttrip.onrender.com"),
  title: {
    default: "MyNextTrip | Premium Travel & Booking Portal",
    template: "%s | MyNextTrip"
  },
  description: "Experience luxury travel with MyNextTrip. Book flights, hotels, and holiday packages at best prices in Patna, Ranchi, Motihari and Nepal.",
  keywords: ["travel", "hotels", "booking", "patna hotels", "ranchi hotels", "luxury travel", "mynexttrip"],
  authors: [{ name: "MyNextTrip Team" }],
  creator: "MyNextTrip",
  publisher: "MyNextTrip",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://mynexttrip.onrender.com",
    siteName: "MyNextTrip",
    title: "MyNextTrip | Premium Travel & Booking Portal",
    description: "Experience luxury travel with MyNextTrip. Book flights, hotels, and holiday packages at best prices.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MyNextTrip Travel Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyNextTrip | Premium Travel & Booking Portal",
    description: "Book flights, hotels, and staycations at the best prices with MyNextTrip.",
    images: ["/images/og-image.png"],
    creator: "@mynexttrip",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
