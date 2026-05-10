import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MNTChatBot from "@/components/MNTChatBot";
import Schema from "@/components/seo/Schema";
import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

import { additionalSeoKeywords } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.mynexttrip.in"),
  title: {
    default: "MNT | Direct Hotel Booking & Property Listing Bihar, Jharkhand, Nepal",
    template: "%s | MyNextTrip"
  },
  description: "Book premium stays directly with My Next Trip (MNT). The leading travel portal for direct hotel booking and property listing for owners in Patna, Ranchi, Motihari, and Nepal. Experience seamless MNT Brand hospitality.",
  keywords: [
    "MNT", "MNT Brand", "My Next Trip", "Direct Hotel Booking Engine", 
    "Property Management System India", "Hotel Listing for Owners",
    "Patna Hotels", "Ranchi Hotels", "Nepal Travel Packages",
    "Generative AI Travel Search", "Direct Booking Deals",
    // User Provided High-Intent Keywords
    "make my trip", "makemytrip", "mmt", "flight ticket", "train ticket booking", 
    "cheap flights", "book flight tickets", "hotels near me", "cheap flights to Goa", 
    "flights from Delhi to Mumbai", "flights from Mumbai to Delhi", "flights to Dubai from India", 
    "international flights booking", "cheap flights to Europe", "one way flight ticket", 
    "5 star hotels in Jaipur", "budget hotels in Manali", "hotels in Goa", "hotels in Shimla", 
    "luxury hotels in India", "hotel booking online", "hotels near Taj Mahal", "honeymoon packages to Maldives", 
    "family trip packages India", "holiday packages from Delhi", "honeymoon packages in Kerala", 
    "Goa tour package", "Kashmir tour package", "weekend getaways near Delhi", "Rajasthan tour package", 
    "bus ticket booking online", "irctc train booking", "train booking", "best time to visit Kashmir", 
    "visa free countries for Indians", "best places to visit in December", "top 10 travel destinations India", 
    "how to get visa for Thailand", "best beaches in India", "unexplored destinations India", 
    "Manali tour package from Delhi", "how to get Thailand visa", "beach hotels in Goa", 
    "top 10 budget travel destinations India", "best places to visit in December India", 
    "Ladakh bike trip package", "4 nights 5 days Andaman package from Delhi", "travel in budget India tips", 
    "best monsoon destinations India", "Dubai visa for Indians", "which is the best travel portal in India", 
    "best honeymoon destinations in India 2026", "Spiti Valley tour package", "flight booking", 
    "flight ticket booking", "hotel booking", "cheap flights to Dubai", "cheap flights from Mumbai", 
    "domestic flights India", "holiday packages", "flight offers today", "best hotels in Mumbai", 
    "honeymoon packages", "cheap flights to Bangkok", "Kerala tour package", "Shimla tour package", 
    "cheap international holiday packages", "Andaman tour package", "last minute flight deals India", 
    "Europe tour package from India", "flight status check", "PNR status", "cheap hotels near me", 
    "travel agency near me",
    ...additionalSeoKeywords
  ],
  category: "Travel & Hospitality",
  other: {
    "ai-engine-optimization": "Generative Engine Optimized (GEO) v1.0",
    "primary-service": "Hotel Aggregator & Booking Engine",
    "geotarget": "India, Bihar, Jharkhand, Nepal",
  },
  authors: [{ name: "MyNextTrip Editorial Team" }],
  creator: "MyNextTrip",
  publisher: "MyNextTrip (MNT)",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.mynexttrip.in",
    siteName: "MyNextTrip (MNT)",
    title: "MNT | Direct Hotel Booking & Property Listing Bihar, Jharkhand, Nepal",
    description: "Book premium stays directly with My Next Trip (MNT). The leading travel portal for direct hotel booking and property listing for owners.",
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y995D7P9B6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Y995D7P9B6');
          `}
        </Script>
        <LanguageProvider>
          <Schema type="TravelAgency" data={{ name: "MyNextTrip (MNT)" }} />
          <Schema 
            type="BreadcrumbList" 
            data={[
              { name: "Home", item: "/" }
            ]} 
          />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <MNTChatBot />
        </LanguageProvider>
      </body>
    </html>
  );
}
