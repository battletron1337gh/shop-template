'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, 
  Droplets, 
  Wrench, 
  Wind, 
  CircleDot, 
  CarFront,
  ArrowRight
} from 'lucide-react';
import { services } from '@/data/cars';

const iconMap: Record<string, React.ReactNode> = {
  ClipboardCheck: <ClipboardCheck className="w-8 h-8" />,
  Droplets: <Droplets className="w-8 h-8" />,
  Wrench: <Wrench className="w-8 h-8" />,
  Wind: <Wind className="w-8 h-8" />,
  CircleDot: <CircleDot className="w-8 h-8" />,
  CarFront: <CarFront className="w-8 h-8" />,
};

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const
    }
  }
};

export default function Services() {
  return (
    <section className="py-20 lg:py-32 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#c8102e] font-semibold text-sm uppercase tracking-wider mb-4">
            Onderhoud & Service
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Onderhoud bij Car Store Cuijk
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Van APK-keuring tot complete onderhoudsbeurten – wij zorgen ervoor dat uw auto in topconditie blijft.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 hover:border-[#c8102e]/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-[#c8102e]/10 text-[#c8102e] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#c8102e] group-hover:text-white transition-colors duration-300">
                {iconMap[service.icon]}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#c8102e] transition-colors">
                {service.title}
              </h3>
              <p className="text-white/50 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/40">
                    <span className="w-1.5 h-1.5 bg-[#c8102e] rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Price */}
              {service.price && (
                <div className="mb-6">
                  <span className="text-2xl font-bold text-[#c8102e]">
                    €{service.price}
                  </span>
                  <span className="text-white/40 text-sm"> vanaf</span>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/onderhoud"
                className="inline-flex items-center gap-2 text-white font-semibold group-hover:text-[#c8102e] transition-colors"
              >
                Meer info
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 lg:p-12 border border-white/5"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Direct een afspraak maken?
          </h3>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            Plan uw onderhoud, APK of reparatie eenvoudig via WhatsApp of telefoon. 
            Wij zorgen voor een snelle service!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/31612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#c8102e] hover:bg-[#a00d24] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Afspraak via WhatsApp
            </a>
            <a
              href="tel:0485451234"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Bel: 0485 - 451 234
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
