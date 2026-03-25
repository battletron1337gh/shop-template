import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Services from '@/components/Services';
import { Wrench, Phone, MessageCircle, Clock, CheckCircle, Shield } from 'lucide-react';
import { openingHours, contactInfo } from '@/data/cars';

export default function OnderhoudPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 lg:pt-28">
        {/* Hero */}
        <section className="bg-[#0a0a0a] py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 bg-[#c8102e]/20 border border-[#c8102e]/40 text-white rounded-full px-4 py-2 mb-6">
                <Wrench className="w-4 h-4" />
                Vakkundige service
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Onderhoud & <span className="text-[#c8102e]">Service</span>
              </h1>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">
                Professioneel onderhoud voor uw auto, ongeacht het merk. 
                Vertrouw op onze ervaren monteurs en moderne werkplaats.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <Services />

        {/* Why Service With Us */}
        <section className="py-20 lg:py-32 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Waarom kiezen voor onze werkplaats?
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                Wij staan garant voor kwaliteit en vakmanschap. Uw auto is bij ons in goede handen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <CheckCircle className="w-8 h-8" />, title: 'BOVAG Erkend', desc: 'Wij zijn BOVAG erkend, wat staat voor kwaliteit en betrouwbaarheid.' },
                { icon: <Shield className="w-8 h-8" />, title: 'Garantie', desc: 'Garantie op alle uitgevoerde werkzaamheden en onderdelen.' },
                { icon: <Wrench className="w-8 h-8" />, title: 'Alle Merken', desc: 'Wij onderhouden en repareren alle automerken.' },
                { icon: <Clock className="w-8 h-8" />, title: 'Snelle Service', desc: 'Efficiënte planning zodat u snel weer de weg op kunt.' },
                { icon: <CheckCircle className="w-8 h-8" />, title: 'Transparante Prijzen', desc: 'Duidelijke prijzen zonder verborgen kosten.' },
                { icon: <Shield className="w-8 h-8" />, title: 'Originele Onderdelen', desc: 'Gebruik van originele of A-merk onderdelen.' },
              ].map((item, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5">
                  <div className="w-14 h-14 bg-[#c8102e]/20 text-[#c8102e] rounded-xl flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 lg:py-32 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#1a1a1a] rounded-3xl p-8 lg:p-12 border border-white/5">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Maak direct een afspraak
                  </h2>
                  <p className="text-white/50 mb-8 text-lg">
                    Plan uw onderhoud, APK of reparatie eenvoudig via WhatsApp of telefoon. 
                    Wij zorgen voor een snelle en vakkundige service.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/\s|-/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#c8102e] hover:bg-[#a00d24] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Afspraak via WhatsApp
                    </a>
                    <a
                      href={`tel:${contactInfo.telefoon.replace(/\s|-/g, '')}`}
                      className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      {contactInfo.telefoon}
                    </a>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-6">Openingstijden</h3>
                  <div className="space-y-3">
                    {openingHours.map((hours) => (
                      <div key={hours.dag} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-white/50">{hours.dag}</span>
                        <span className="font-medium text-white">{hours.opening} - {hours.sluiting}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-white/30 mt-4">
                    Na 18:00 op afspraak mogelijk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
