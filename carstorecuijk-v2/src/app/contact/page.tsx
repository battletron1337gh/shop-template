import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { contactInfo, openingHours } from '@/data/cars';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 lg:pt-28">
        {/* Hero */}
        <section className="bg-[#0a0a0a] py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Contact <span className="text-[#c8102e]">Opnemen</span>
              </h1>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">
                Heeft u vragen of wilt u een afspraak maken? 
                Neem gerust contact met ons op. Wij helpen u graag!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20 lg:py-32 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Cards */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <a
                    href={`tel:${contactInfo.telefoon.replace(/\s|-/g, '')}`}
                    className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 hover:border-[#c8102e]/30 transition-colors group"
                  >
                    <div className="w-14 h-14 bg-[#c8102e]/10 text-[#c8102e] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c8102e] group-hover:text-white transition-colors">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Telefoon</h3>
                    <p className="text-[#c8102e] font-semibold">{contactInfo.telefoon}</p>
                    <p className="text-white/40 text-sm mt-2">Direct iemand te spreken</p>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/\s|-/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 hover:border-green-500/30 transition-colors group"
                  >
                    <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">WhatsApp</h3>
                    <p className="text-green-500 font-semibold">{contactInfo.whatsapp}</p>
                    <p className="text-white/40 text-sm mt-2">Snelle reactie gegarandeerd</p>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 hover:border-[#c8102e]/30 transition-colors group"
                  >
                    <div className="w-14 h-14 bg-[#c8102e]/10 text-[#c8102e] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c8102e] group-hover:text-white transition-colors">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">E-mail</h3>
                    <p className="text-[#c8102e] font-semibold">{contactInfo.email}</p>
                    <p className="text-white/40 text-sm mt-2">Wij reageren binnen 24 uur</p>
                  </a>

                  {/* Address */}
                  <a
                    href={`https://maps.google.com/?q=${contactInfo.adres}, ${contactInfo.postcode} ${contactInfo.plaats}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 hover:border-[#c8102e]/30 transition-colors group"
                  >
                    <div className="w-14 h-14 bg-[#c8102e]/10 text-[#c8102e] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c8102e] group-hover:text-white transition-colors">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Adres</h3>
                    <p className="text-[#c8102e] font-semibold">{contactInfo.plaats}</p>
                    <p className="text-white/40 text-sm mt-2">{contactInfo.adres}, {contactInfo.postcode}</p>
                  </a>
                </div>

                {/* Opening Hours */}
                <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#c8102e]/10 text-[#c8102e] rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Openingstijden</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {openingHours.map((hours) => (
                      <div key={hours.dag} className="flex justify-between py-3 border-b border-white/5">
                        <span className="text-white/50">{hours.dag}</span>
                        <span className="font-medium text-white">{hours.opening} - {hours.sluiting}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-white/30 mt-4">
                    <span className="text-[#c8102e] font-medium">Let op:</span> Na 18:00 op afspraak mogelijk
                  </p>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-6">Direct contact</h3>
                  <div className="space-y-4">
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/\s|-/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#c8102e] hover:bg-[#a00d24] text-white py-4 rounded-xl font-semibold transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp Ons
                    </a>
                    <a
                      href={`tel:${contactInfo.telefoon.replace(/\s|-/g, '')}`}
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 rounded-xl font-semibold transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      Bel Ons
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-6">Volg ons</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-pink-500/20 text-white hover:text-pink-400 py-3 rounded-xl transition-all border border-white/5 hover:border-pink-500/30"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="font-medium">Instagram</span>
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-blue-500/20 text-white hover:text-blue-400 py-3 rounded-xl transition-all border border-white/5 hover:border-blue-500/30"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="font-medium">Facebook</span>
                    </a>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center aspect-square flex flex-col items-center justify-center border border-white/5">
                  <MapPin className="w-12 h-12 text-[#c8102e] mb-4" />
                  <p className="text-white font-medium">Google Maps</p>
                  <p className="text-white/40 text-sm mt-2">Veldweg 28, Cuijk</p>
                  <a
                    href={`https://maps.google.com/?q=${contactInfo.adres}, ${contactInfo.postcode} ${contactInfo.plaats}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c8102e] hover:underline text-sm mt-4"
                  >
                    Open in Google Maps →
                  </a>
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
