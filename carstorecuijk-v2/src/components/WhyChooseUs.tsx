'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Clock, Award, Wrench, BadgeCheck } from 'lucide-react';

const reasons = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Betrouwbaar',
    description: 'Al onze occasions worden grondig gecontroleerd. U koopt met vertrouwen.'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Persoonlijk',
    description: 'Wij denken met u mee en vinden de auto die bij u past. Geen standaard verhaal.'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: '7 Dagen Open',
    description: 'Wij zijn 7 dagen per week open. Ook \'s avonds op afspraak mogelijk.'
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Erkend',
    description: 'BOVAG en RDW erkend. U bent verzekerd van kwaliteit en zekerheid.'
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Vakkundig',
    description: 'Onze monteurs werken volgens fabrieksvoorschriften met moderne apparatuur.'
  },
  {
    icon: <BadgeCheck className="w-8 h-8" />,
    title: 'Transparant',
    description: 'Duidelijke prijzen zonder verborgen kosten. U weet precies waar u aan toe bent.'
  }
];

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

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-32 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-20" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8102e]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c8102e]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#c8102e] font-semibold text-sm uppercase tracking-wider mb-4">
            Waarom Wij
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Waarom Car Store Cuijk?
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Al jaren de vertrouwde partner voor occasions en onderhoud in Cuijk en omgeving.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 hover:border-[#c8102e]/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-[#c8102e]/10 text-[#c8102e] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#c8102e] group-hover:text-white transition-colors duration-300">
                {reason.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {reason.title}
              </h3>
              <p className="text-white/50 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
