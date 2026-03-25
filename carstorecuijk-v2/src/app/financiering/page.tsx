import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calculator, CheckCircle, Shield, Clock, Wallet, Percent } from 'lucide-react';
import Link from 'next/link';

export default function FinancieringPage() {
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
                <Wallet className="w-4 h-4" />
                Financiële oplossingen
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Financiering & <span className="text-[#c8102e]">Verzekering</span>
              </h1>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">
                Flexibele financieringsmogelijkheden voor uw occasion. 
                Wij regelen het voor u tegen scherpe tarieven.
              </p>
            </div>
          </div>
        </section>

        {/* Financing Options */}
        <section className="py-20 lg:py-32 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Waarom bij ons financieren?
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                Wij werken samen met gerenommeerde financieringspartners om u de beste voorwaarden te bieden.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Percent className="w-8 h-8" />, title: 'Scherpe Rentes', desc: 'Door onze samenwerking met meerdere banken kunnen wij u de scherpste rente bieden.' },
                { icon: <Clock className="w-8 h-8" />, title: 'Snelle Afhandeling', desc: 'Binnen 24 uur weten u of uw financiering wordt goedgekeurd.' },
                { icon: <Calculator className="w-8 h-8" />, title: 'Flexibele Looptijden', desc: 'Kies een looptijd die bij u past, van 12 tot 120 maanden.' },
                { icon: <Shield className="w-8 h-8" />, title: 'All-risk Verzekering', desc: 'Voordelige all-risk verzekeringen speciaal voor occasions.' },
                { icon: <Wallet className="w-8 h-8" />, title: 'Lage Maandlasten', desc: 'Door onze scherpe tarieven houdt u geld over voor andere dingen.' },
                { icon: <CheckCircle className="w-8 h-8" />, title: 'Geen BKR-toetsing', desc: 'In veel gevallen geen BKR-toetsing nodig voor de financiering.' },
              ].map((item, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 hover:border-[#c8102e]/30 transition-colors">
                  <div className="w-14 h-14 bg-[#c8102e]/10 text-[#c8102e] rounded-xl flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-32 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Hoe werkt het?
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                In 3 eenvoudige stappen rijdt u in uw nieuwe auto.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Kies uw auto', desc: 'Bekijk ons aanbod en kies de occasion die bij u past.' },
                { step: '2', title: 'Aanvraag indienen', desc: 'Wij regelen de financieringsaanvraag voor u bij onze partners.' },
                { step: '3', title: 'Rijden maar!', desc: 'Na goedkeuring kunt u direct de weg op in uw nieuwe auto.' },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 relative z-10">
                    <div className="w-12 h-12 bg-[#c8102e] text-white rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/50">{item.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#c8102e] z-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Calculation */}
        <section className="py-20 lg:py-32 bg-[#c8102e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Voorbeeld berekening
                </h2>
                <p className="text-white/80 mb-8 text-lg">
                  Een auto van €15.000 financieren? Dat kan al vanaf €250 per maand. 
                  De exacte maandlast hangt af van uw persoonlijke situatie.
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-white/20">
                    <span className="text-white/70">Auto prijs</span>
                    <span className="text-white font-semibold">€15.000</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/20">
                    <span className="text-white/70">Aanbetaling</span>
                    <span className="text-white font-semibold">€1.500 (10%)</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/20">
                    <span className="text-white/70">Te financieren</span>
                    <span className="text-white font-semibold">€13.500</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-white/70">Maandbedrag*</span>
                    <span className="text-white font-bold text-xl">vanaf €250</span>
                  </div>
                </div>
                
                <p className="text-white/50 text-sm mt-4">* Voorbeeld bij 60 maanden looptijd</p>
              </div>

              <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Vraag een offerte aan
                </h3>
                <p className="text-white/70 mb-8">
                  Geïnteresseerd in financiering? Neem contact met ons op voor een vrijblijvende offerte.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 bg-white text-[#c8102e] py-4 rounded-xl font-semibold transition-all hover:bg-white/90"
                  >
                    Offerte Aanvragen
                  </Link>
                  <Link
                    href="/occasions"
                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 rounded-xl font-semibold transition-all"
                  >
                    Bekijk Occasions
                  </Link>
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
