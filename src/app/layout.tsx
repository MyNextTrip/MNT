import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MNTChatBot from "@/components/MNTChatBot";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.mynexttrip.in"),
  title: {
    default: "MNT | Direct Hotel Booking & Property Listing Bihar, Jharkhand, Nepal",
    template: "%s | MyNextTrip"
  },
  description: "Book premium stays directly with My Next Trip (MNT). The leading travel portal for direct hotel booking and property listing for owners in Patna, Ranchi, Motihari, and Nepal. Experience seamless MNT Brand hospitality.",
  keywords: ["MNT Brand", "My Next Trip Hotel Booking", "Direct Booking Engine Bihar", "Property Listing for Owners Ranchi", "Nepal Travel Packages MNT", "patna hotels", "ranchi hotels"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <LanguageProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "My Next Trip (MNT)",
                "alternateName": "MNT Travel",
                "url": "https://www.mynexttrip.in",
                "logo": "https://www.mynexttrip.in/images/mnt-logo-new.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91-92635-54855",
                  "contactType": "customer service",
                  "areaServed": ["IN", "NP"],
                  "availableLanguage": ["en", "hi"]
                },
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Bariatu Road",
                  "addressLocality": "Ranchi",
                  "addressRegion": "Jharkhand",
                  "postalCode": "834001",
                  "addressCountry": "IN"
                },
                "sameAs": [
                  "https://www.facebook.com/profile.php?id=61575468341367",
                  "https://www.instagram.com/mynexttrip07/",
                  "https://www.youtube.com/channel/UC71Zk6DnIdPEqAkq3-JyFpA"
                ]
              })
            }}
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
