import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TrustFactors from "@/components/TrustFactors";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MNT | Best Hotels in Ranchi, Patna & India | Direct Booking Portal",
  description: "Book premium stays directly with My Next Trip (MNT). Best hotels in Patna, Ranchi, Motihari and all over India. Better than MakeMyTrip, Booking.com & Yatra for direct hotel deals. Find hotels near me and the best hotels in India with MNT.",
  keywords: [
    "mnt", "makemytrip", "booking.com", "yatra.com", "ranchi hotels", "patna hotels", 
    "motihari hotels", "india best hotels", "near me hotels", "best hotels in ranchi", 
    "best hotels in patna", "best hotels in india", "MNT Brand", "direct booking portal"
  ],
  openGraph: {
    title: "MNT | Best Hotels in Ranchi, Patna & India | Direct Booking Portal",
    description: "Book premium stays directly with MNT. Find the best hotels in Patna, Ranchi, and all over India at best prices.",
    url: "https://www.mynexttrip.in",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "MyNextTrip (MNT)",
  "url": "https://www.mynexttrip.in",
  "logo": "https://www.mynexttrip.in/images/mnt-logo-new.png",
  "description": "Premium travel agency and hospitality aggregator in Patna and Ranchi. Specializing in direct hotel bookings and property listing for owners across Bihar, Jharkhand, and Nepal.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bariatu Road",
    "addressLocality": "Ranchi",
    "addressRegion": "Jharkhand",
    "postalCode": "834001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "23.3441",
    "longitude": "85.3091"
  },
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61575468341367",
    "https://www.instagram.com/mynexttrip07/",
    "https://www.youtube.com/channel/UC71Zk6DnIdPEqAkq3-JyFpA"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9263554855",
    "contactType": "customer service",
    "areaServed": ["IN", "NP"],
    "availableLanguage": ["Hindi", "English"]
  }
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Services />
      
      {/* Visual Break / CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready for Your Next <span className="text-secondary italic">Bucket List</span> Adventure?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">Join 1.5 million travelers who trust MyNextTrip for their most precious memories. Exclusive deals waiting for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-secondary hover:text-gray-900 transition-all shadow-xl hover:-translate-y-1 w-full sm:w-auto"
              suppressHydrationWarning
            >
              Explore Holiday Packages
            </button>
            <button 
              className="bg-transparent border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all w-full sm:w-auto"
              suppressHydrationWarning
            >
              Contact a Travel Expert
            </button>
          </div>
        </div>
      </section>

      <TrustFactors />
      
      {/* Brands Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 uppercase text-[10px] font-black tracking-[0.4em] text-gray-400 text-center mb-8">
          Trusted by Industry Leaders
        </div>
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
           <div className="text-xl font-black italic">Expedia</div>
           <div className="text-xl font-bold">Hilton</div>
           <div className="text-xl font-black tracking-tighter">Marriott</div>
           <div className="text-xl font-bold font-serif">Radisson</div>
           <div className="text-xl font-black">Emirates</div>
        </div>
      </section>
    </div>
  );
}
