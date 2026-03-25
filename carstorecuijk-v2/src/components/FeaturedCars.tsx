'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { cars } from '@/data/cars';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

export default function FeaturedCars() {
  // Get only available cars, sorted by newest (highest year), show only 3
  const featuredCars = cars
    .filter(car => car.status === 'beschikbaar')
    .sort((a, b) => b.bouwjaar - a.bouwjaar)
    .slice(0, 3);

  return (
    <section id="occasions" className="py-20 lg:py-32 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#c8102e] font-semibold text-sm uppercase tracking-wider mb-4">
            Ons Aanbod
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Uitgelichte Occasions
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Ontdek ons ruime aanbod kwalitatieve occasions. 
            Alle auto&apos;s worden grondig gecontroleerd voordat ze te koop staan.
          </p>
        </motion.div>

        {/* Cars Grid - Only 3 cars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <Link
            href="/occasions"
            className="group inline-flex items-center gap-2 bg-[#c8102e] hover:bg-[#a00d24] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#c8102e]/25"
          >
            Bekijk Alle Occasions
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
