import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TrustFactors from "@/components/TrustFactors";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyNextTrip | Premium Travel & Booking Portal",
  description: "Book luxury hotels, flights and holiday packages at the best prices. Experience seamless travel planning with MyNextTrip.",
  openGraph: {
    title: "MyNextTrip | Premium Travel & Booking Portal",
    description: "Book luxury hotels, flights and holiday packages at the best prices.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyNextTrip",
  "url": "https://mynexttrip.onrender.com",
  "logo": "https://mynexttrip.onrender.com/logo.png",
  "sameAs": [
    "https://facebook.com/mynexttrip",
    "https://twitter.com/mynexttrip",
    "https://instagram.com/mynexttrip"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "customer service"
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
            <button className="bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-secondary hover:text-gray-900 transition-all shadow-xl hover:-translate-y-1 w-full sm:w-auto">
              Explore Holiday Packages
            </button>
            <button className="bg-transparent border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all w-full sm:w-auto">
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
