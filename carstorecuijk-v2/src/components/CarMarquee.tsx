'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cars } from '@/data/cars';

export default function CarMarquee() {
  const availableCars = cars.filter(car => car.status === 'beschikbaar');
  const carsMulti = [...availableCars, ...availableCars, ...availableCars, ...availableCars, ...availableCars, ...availableCars];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const scrollPos = useRef(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Auto-scroll animatie
  const animate = useCallback(() => {
    if (!isPaused && containerRef.current) {
      scrollPos.current += 1.2; // Sneller dan reviews
      
      // Reset bij het einde
      const maxScroll = containerRef.current.scrollWidth / 2;
      if (scrollPos.current >= maxScroll) {
        scrollPos.current = 0;
      }
      
      containerRef.current.scrollLeft = scrollPos.current;
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Touch handling
  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    // Update scrollPos zodat animatie verder gaat vanaf nieuwe positie
    if (containerRef.current) {
      scrollPos.current = containerRef.current.scrollLeft;
    }
    setIsPaused(false);
  };

  const handleScroll = () => {
    if (containerRef.current && isPaused) {
      scrollPos.current = containerRef.current.scrollLeft;
    }
  };

  return (
    <section className="py-10 sm:py-16 bg-[#0a0a0a] overflow-hidden border-y border-white/5">
      <div className="mb-4 sm:mb-8 text-center px-4">
        <h3 className="text-base sm:text-xl font-semibold text-white/80">
          Bekijk al onze occasions
        </h3>
        <p className="text-white/40 text-xs sm:text-sm mt-1">
          Raak aan om te pauzeren, swipe om te scrollen
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <div 
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onScroll={handleScroll}
          style={{ 
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {carsMulti.map((car, index) => (
            <Link 
              key={`${car.id}-${index}`} 
              href={`/occasions/${car.id}`}
              className="group block flex-shrink-0 w-[200px] sm:w-[240px] lg:w-[280px] mx-1.5 sm:mx-2 lg:mx-3"
            >
              <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 hover:border-[#c8102e]/50 transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0d0d]">
                  <Image
                    src={car.afbeeldingen[0] || '/cars/placeholder.svg'}
                    alt={`${car.merk} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-[#c8102e] transition-colors line-clamp-1 mb-0.5 sm:mb-1">
                    {car.merk} {car.model}
                  </h3>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#c8102e]">
                    {formatPrice(car.prijs)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
