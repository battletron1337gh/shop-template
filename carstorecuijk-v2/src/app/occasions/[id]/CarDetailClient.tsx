'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Fuel, 
  Gauge, 
  Settings2,
  Car,
  Check,
  MessageCircle,
  Phone,
  Share2,
  Heart,
  AlertCircle
} from 'lucide-react';
import { cars } from '@/data/cars';
import CarCard from '@/components/CarCard';

interface CarDetailClientProps {
  carId: string;
}

export default function CarDetailClient({ carId }: CarDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const car = cars.find(c => c.id === carId);
  
  // Get similar cars
  const similarCars = cars
    .filter(c => c.id !== carId && c.merk === car?.merk && c.status === 'beschikbaar')
    .slice(0, 3);

  if (!car) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Auto niet gevonden</h1>
          <Link href="/occasions" className="text-[#c8102e] hover:underline">
            Terug naar occasions
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatKilometers = (km: number) => {
    return new Intl.NumberFormat('nl-NL').format(km);
  };

  const getStatusBadge = () => {
    switch (car.status) {
      case 'gereserveerd':
        return (
          <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-500 px-4 py-2 rounded-full font-semibold border border-amber-500/30">
            <AlertCircle className="w-4 h-4" />
            Gereserveerd
          </span>
        );
      case 'verkocht':
        return (
          <span className="inline-flex items-center gap-2 bg-gray-500/20 text-gray-400 px-4 py-2 rounded-full font-semibold border border-gray-500/30">
            Verkocht
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen pt-24 lg:pt-28 bg-[#0a0a0a]">
      {/* Breadcrumb & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/occasions" 
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar occasions
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg transition-colors ${isFavorite ? 'bg-[#c8102e]/20 text-[#c8102e]' : 'bg-[#1a1a1a] text-white/40 hover:text-white'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 bg-[#1a1a1a] text-white/40 hover:text-white rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5">
              <div className="relative aspect-[16/10] bg-[#0d0d0d]">
                <Image
                  src={car.afbeeldingen[selectedImage] || '/cars/placeholder.svg'}
                  alt={`${car.merk} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                />
                {getStatusBadge() && (
                  <div className="absolute top-4 left-4">
                    {getStatusBadge()}
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-6">Specificaties</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <Calendar className="w-5 h-5 text-[#c8102e]" />
                  <div>
                    <p className="text-sm text-white/50">Bouwjaar</p>
                    <p className="font-semibold text-white">{car.bouwjaar}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <Gauge className="w-5 h-5 text-[#c8102e]" />
                  <div>
                    <p className="text-sm text-white/50">Kilometerstand</p>
                    <p className="font-semibold text-white">{formatKilometers(car.kilometerstand)} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <Fuel className="w-5 h-5 text-[#c8102e]" />
                  <div>
                    <p className="text-sm text-white/50">Brandstof</p>
                    <p className="font-semibold text-white">{car.brandstof}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <Settings2 className="w-5 h-5 text-[#c8102e]" />
                  <div>
                    <p className="text-sm text-white/50">Transmissie</p>
                    <p className="font-semibold text-white">{car.transmissie}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <Car className="w-5 h-5 text-[#c8102e]" />
                  <div>
                    <p className="text-sm text-white/50">Carrosserie</p>
                    <p className="font-semibold text-white">{car.carrosserie}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <Check className="w-5 h-5 text-[#c8102e]" />
                  <div>
                    <p className="text-sm text-white/50">APK</p>
                    <p className="font-semibold text-white">{car.apk}</p>
                  </div>
                </div>
              </div>

              {car.vermogen && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-white/50">Vermogen</p>
                      <p className="font-semibold text-white">{car.vermogen}</p>
                    </div>
                    {car.verbruik && (
                      <div>
                        <p className="text-sm text-white/50">Verbruik</p>
                        <p className="font-semibold text-white">{car.verbruik}</p>
                      </div>
                    )}
                    {car.co2 && (
                      <div>
                        <p className="text-sm text-white/50">CO₂</p>
                        <p className="font-semibold text-white">{car.co2}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4">Beschrijving</h2>
              <p className="text-white/60 leading-relaxed">{car.beschrijving}</p>
            </div>

            {/* Features */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4">Kenmerken</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {car.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#c8102e]" />
                    <span className="text-white/60">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Price & Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Price Card */}
              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-white">
                    {car.merk} {car.model}
                  </h1>
                  <p className="text-white/50">{car.variant}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-white/40 mb-1">Prijs</p>
                  <p className="text-4xl font-bold text-[#c8102e]">{formatPrice(car.prijs)}</p>
                  <p className="text-sm text-white/40 mt-1">Incl. BTW & BPM</p>
                </div>

                {car.status === 'beschikbaar' ? (
                  <div className="space-y-3">
                    <a
                      href={`https://wa.me/31612345678?text=Ik ben geïnteresseerd in de ${car.merk} ${car.model} (${car.id})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#c8102e] hover:bg-[#a00d24] text-white py-4 rounded-xl font-semibold transition-all duration-300"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp Ons
                    </a>
                    <a
                      href="tel:0485451234"
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 rounded-xl font-semibold transition-all duration-300"
                    >
                      <Phone className="w-5 h-5" />
                      Bel: 0485 - 451 234
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5">
                    <p className="text-white/60 font-medium">
                      Deze auto is {car.status === 'gereserveerd' ? 'gereserveerd' : 'verkocht'}
                    </p>
                    <Link 
                      href="/occasions" 
                      className="text-[#c8102e] hover:underline text-sm mt-2 inline-block"
                    >
                      Bekijk andere occasions →
                    </Link>
                  </div>
                )}
              </div>

              {/* Dealer Info */}
              <div className="bg-[#0d0d0d] rounded-2xl p-6 text-white border border-white/5">
                <h3 className="font-bold mb-4">Car Store Cuijk</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-white/50">Veldweg 28<br />5431 NS Cuijk</p>
                  <p className="text-white/50">7 dagen per week open<br />07:30 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Vergelijkbare occasions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
