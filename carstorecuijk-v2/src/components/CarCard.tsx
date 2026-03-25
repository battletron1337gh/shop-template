'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Fuel, Gauge, Settings2 } from 'lucide-react';
import { Car } from '@/types';

interface CarCardProps {
  car: Car;
  index?: number;
  compact?: boolean;
}

export default function CarCard({ car, index = 0, compact = false }: CarCardProps) {
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
          <span className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            Gereserveerd
          </span>
        );
      case 'verkocht':
        return (
          <span className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            Verkocht
          </span>
        );
      default:
        return null;
    }
  };

  // Compact version for the marquee
  if (compact) {
    return (
      <Link href={`/occasions/${car.id}`} className="group block flex-shrink-0 w-[280px] mx-3">
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#c8102e]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#c8102e]/10">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0d0d]">
            {getStatusBadge()}
            <Image
              src={car.afbeeldingen[0] || '/cars/placeholder.svg'}
              alt={`${car.merk} ${car.model} ${car.variant}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="280px"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
          </div>

          {/* Content - Only Price */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-white group-hover:text-[#c8102e] transition-colors line-clamp-1 mb-1">
              {car.merk} {car.model}
            </h3>
            <p className="text-2xl font-bold text-[#c8102e]">
              {formatPrice(car.prijs)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Full version
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/occasions/${car.id}`} className="group block">
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#c8102e]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#c8102e]/10">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0d0d]">
            {getStatusBadge()}
            <Image
              src={car.afbeeldingen[0] || '/cars/placeholder.svg'}
              alt={`${car.merk} ${car.model} ${car.variant}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <div className="mb-3">
              <h3 className="text-lg font-bold text-white group-hover:text-[#c8102e] transition-colors line-clamp-1">
                {car.merk} {car.model}
              </h3>
              <p className="text-sm text-white/50 line-clamp-1">{car.variant}</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar className="w-4 h-4 text-[#c8102e]" />
                <span>{car.bouwjaar}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Gauge className="w-4 h-4 text-[#c8102e]" />
                <span>{formatKilometers(car.kilometerstand)} km</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Fuel className="w-4 h-4 text-[#c8102e]" />
                <span>{car.brandstof}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Settings2 className="w-4 h-4 text-[#c8102e]" />
                <span>{car.transmissie}</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {car.features.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded border border-white/10"
                >
                  {feature}
                </span>
              ))}
              {car.features.length > 3 && (
                <span className="text-xs text-white/40 px-1">
                  +{car.features.length - 3}
                </span>
              )}
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <span className="text-xs text-white/40 block">Prijs</span>
                <span className="text-xl font-bold text-[#c8102e]">
                  {formatPrice(car.prijs)}
                </span>
              </div>
              <span className="text-sm font-medium text-white group-hover:text-[#c8102e] transition-colors flex items-center gap-1">
                Bekijk
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
