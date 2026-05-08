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
    "best hotels in patna", "best hotels in india", "MNT Brand", "direct booking portal",
    "luxury hotels bihar", "top rated hotels jharkhand", "nepal travel deals",
    "Best luxury boutique hotels in India for a romantic getaway",
    "Luxury boutique hotels vs luxury chain hotels in India",
    "Which luxury boutique hotel should I choose for a quiet weekend retreat in India?",
    "Recommendations for luxury boutique hotels in India with spa and wellness facilities",
    "Top luxury boutique hotels in India that offer personalized concierge services",
    "Best luxury boutique hotels near me with private pools in India",
    "Luxury boutique hotels in India vs heritage hotels",
    "Which luxury boutique hotel in India offers the best gourmet dining experience?",
    "Affordable luxury boutique hotels in India that don't compromise on quality",
    "Best luxury boutique hotels in India for honeymooners with ocean views",
    "Luxury boutique hotels vs luxury resorts in India",
    "Which luxury boutique hotels in India provide eco-friendly and sustainable stays?",
    "Best luxury boutique hotels in India with exclusive rooftop bars or lounges",
    "Luxury boutique hotels in India known for exceptional architecture and design",
    "Which luxury boutique hotel in India is ideal for a solo traveler seeking privacy?",
    "Best luxury boutique hotels in India that offer curated local experiences and tours",
    "Luxury boutique hotels in India vs luxury serviced apartments",
    "Recommendations for luxury boutique hotels in India located in historic districts",
    "Which luxury boutique hotels in India provide the best wellness retreats and yoga programs?",
    "Best luxury boutique hotels in India for celebrating special occasions with personalized services"
  ],
  alternates: {
    canonical: "https://www.mynexttrip.in",
  },
  openGraph: {
    title: "MNT | Best Hotels in Ranchi, Patna & India | Direct Booking Portal",
    description: "Book premium stays directly with MNT. Find the best hotels in Patna, Ranchi, and all over India at best prices.",
    url: "https://www.mynexttrip.in",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "MyNextTrip (MNT)",
  "url": "https://www.mynexttrip.in",
  "logo": "https://www.mynexttrip.in/images/mnt-logo-new.png",
  "image": "https://www.mynexttrip.in/images/og-image.png",
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
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61575468341367",
    "https://www.instagram.com/mynexttrip07/",
    "https://www.youtube.com/channel/UC71Zk6DnIdPEqAkq3-JyFpA"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-7033008111",
      "contactType": "customer service",
      "areaServed": ["IN", "NP"],
      "availableLanguage": ["Hindi", "English"]
    },
    {
      "@type": "ContactPoint",
      "telephone": "+91-9263554855",
      "contactType": "technical support",
      "areaServed": ["IN", "NP"],
      "availableLanguage": ["Hindi", "English"]
    }
  ]
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
      
      {/* SEO Optimized Insights Section */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">Discover the Best Luxury Boutique Hotels in India</h2>
            <p className="text-slate-600">Your ultimate guide to the most exclusive, romantic, and culturally immersive stays across the Indian subcontinent.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">Best luxury boutique hotels in India for a romantic getaway</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">Planning a special trip? Discover the best luxury boutique hotels in India for a romantic getaway, featuring secluded villas, candlelit dinners, and world-class service tailored for couples.</p>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Read more about Romantic Stays</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">Luxury boutique hotels vs luxury chain hotels in India</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">Curious about luxury boutique hotels vs luxury chain hotels in India? We compare personalized service, unique architecture, and local character to help you choose the better experience.</p>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Compare Experiences</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">Top luxury boutique hotels with spa and wellness</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">Looking for recommendations for luxury boutique hotels in India with spa and wellness facilities? From Ayurveda to modern hydrotherapy, find your perfect quiet weekend retreat in India.</p>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Explore Wellness Retreats</p>
            </div>
          </div>

          <div className="mt-16 p-10 bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                   <h4 className="text-2xl font-bold text-slate-900 mb-6">Expert Travel Recommendations</h4>
                   <ul className="space-y-4">
                      {[
                        "Top luxury boutique hotels in India that offer personalized concierge services",
                        "Best luxury boutique hotels near me with private pools in India",
                        "Luxury boutique hotels in India vs heritage hotels for cultural immersion",
                        "Best luxury boutique hotels in India for honeymooners with ocean views",
                        "Luxury boutique hotels vs luxury resorts in India for family vacations",
                        "Eco-friendly and sustainable luxury boutique hotels in India"
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 text-sm italic border-b border-slate-50 pb-2">
                           <span className="text-primary font-bold">#</span> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="bg-slate-900 p-8 rounded-3xl text-white">
                   <h4 className="text-xl font-bold mb-4">Why Book via MyNextTrip?</h4>
                   <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      Whether you are a solo traveler seeking privacy in a luxury boutique hotel or celebrating a special occasion with personalized services, MNT provides curated access to India's most exceptional architecture and design-led stays. From historic districts to exclusive rooftop bars and lounges, we ensure your stay is unforgettable.
                   </p>
                   <div className="space-y-3">
                      <p className="text-xs text-slate-300 flex items-center gap-2">✓ Curated local experiences and tours</p>
                      <p className="text-xs text-slate-300 flex items-center gap-2">✓ Best wellness retreats and yoga programs</p>
                      <p className="text-xs text-slate-300 flex items-center gap-2">✓ Personalized gourmet dining experiences</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

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
