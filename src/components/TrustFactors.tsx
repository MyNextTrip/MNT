"use client";

import { Shield, Clock, Award, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function TrustFactors() {
  const { t } = useLanguage();

  const benefits = [
    { icon: <Shield className="h-8 w-8 text-primary" />, title: t('trust.benefits.0.title'), desc: t('trust.benefits.0.desc') },
    { icon: <Clock className="h-8 w-8 text-primary" />, title: t('trust.benefits.1.title'), desc: t('trust.benefits.1.desc') },
    { icon: <Award className="h-8 w-8 text-primary" />, title: t('trust.benefits.2.title'), desc: t('trust.benefits.2.desc') },
    { icon: <CheckCircle className="h-8 w-8 text-primary" />, title: t('trust.benefits.3.title'), desc: t('trust.benefits.3.desc') },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('trust.title')}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('trust.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx} 
              className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary rounded-[2.5rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-8">{t('trust.testimonials_title')}</h3>
              <div className="space-y-8">
                <blockquote className="text-xl italic font-light text-white/90 border-l-4 border-secondary pl-6">
                  "The most seamless booking experience I've ever had. The attention to detail and curated list of hotels made our anniversary trip truly unforgettable."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full border-2 border-secondary" />
                  <div>
                    <p className="font-bold">Sarah Jenkins</p>
                    <p className="text-white/60 text-sm">Luxury Traveler</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-secondary mb-2">1.5M+</p>
                <p className="text-white/70 uppercase tracking-widest text-xs font-bold">{t('trust.stats.customers')}</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-secondary mb-2">4.9/5</p>
                <p className="text-white/70 uppercase tracking-widest text-xs font-bold">Trustpilot Rating</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-secondary mb-2">500+</p>
                <p className="text-white/70 uppercase tracking-widest text-xs font-bold">{t('trust.stats.destinations')}</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-secondary mb-2">100%</p>
                <p className="text-white/70 uppercase tracking-widest text-xs font-bold">Price Match</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
