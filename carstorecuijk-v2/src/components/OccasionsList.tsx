'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { cars, merken, carrosserieen, brandstoffen } from '@/data/cars';

interface Filters {
  merk: string;
  carrosserie: string;
  brandstof: string;
  transmissie: string;
  minPrijs: number;
  maxPrijs: number;
  minBouwjaar: number;
  maxBouwjaar: number;
}

export default function OccasionsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    merk: '',
    carrosserie: '',
    brandstof: '',
    transmissie: '',
    minPrijs: 0,
    maxPrijs: 50000,
    minBouwjaar: 2000,
    maxBouwjaar: 2025,
  });
  const [sortBy, setSortBy] = useState('nieuwste');

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(car =>
        car.merk.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.variant.toLowerCase().includes(query)
      );
    }

    // Filters
    if (filters.merk) {
      result = result.filter(car => car.merk === filters.merk);
    }
    if (filters.carrosserie) {
      result = result.filter(car => car.carrosserie === filters.carrosserie);
    }
    if (filters.brandstof) {
      result = result.filter(car => car.brandstof === filters.brandstof);
    }
    if (filters.transmissie) {
      result = result.filter(car => car.transmissie === filters.transmissie);
    }
    
    result = result.filter(car => 
      car.prijs >= filters.minPrijs && 
      car.prijs <= filters.maxPrijs &&
      car.bouwjaar >= filters.minBouwjaar &&
      car.bouwjaar <= filters.maxBouwjaar
    );

    // Sort
    switch (sortBy) {
      case 'prijs-laag':
        result.sort((a, b) => a.prijs - b.prijs);
        break;
      case 'prijs-hoog':
        result.sort((a, b) => b.prijs - a.prijs);
        break;
      case 'nieuwste':
        result.sort((a, b) => b.bouwjaar - a.bouwjaar);
        break;
      case 'km-laag':
        result.sort((a, b) => a.kilometerstand - b.kilometerstand);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'minPrijs') return value > 0;
    if (key === 'maxPrijs') return value < 50000;
    if (key === 'minBouwjaar') return value > 2000;
    if (key === 'maxBouwjaar') return value < 2025;
    return value !== '';
  }).length;

  const clearFilters = () => {
    setFilters({
      merk: '',
      carrosserie: '',
      brandstof: '',
      transmissie: '',
      minPrijs: 0,
      maxPrijs: 50000,
      minBouwjaar: 2000,
      maxBouwjaar: 2025,
    });
    setSearchQuery('');
  };

  return (
    <section className="py-8 lg:py-12">
      {/* Search & Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Zoek op merk, model of trefwoord..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white hover:border-[#c8102e] transition-all"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#c8102e] text-white text-sm rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full lg:w-48 px-4 py-3 pr-10 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] cursor-pointer"
            >
              <option value="nieuwste" className="bg-[#1a1a1a]">Nieuwste eerst</option>
              <option value="prijs-laag" className="bg-[#1a1a1a]">Prijs: laag naar hoog</option>
              <option value="prijs-hoog" className="bg-[#1a1a1a]">Prijs: hoog naar laag</option>
              <option value="km-laag" className="bg-[#1a1a1a]">Kilometerstand: laag naar hoog</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 bg-[#1a1a1a] rounded-2xl border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Merk */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Merk</label>
                <select
                  value={filters.merk}
                  onChange={(e) => setFilters({ ...filters, merk: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e]"
                >
                  <option value="" className="bg-[#0a0a0a]">Alle merken</option>
                  {merken.map((merk) => (
                    <option key={merk} value={merk} className="bg-[#0a0a0a]">{merk}</option>
                  ))}
                </select>
              </div>

              {/* Carrosserie */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Carrosserie</label>
                <select
                  value={filters.carrosserie}
                  onChange={(e) => setFilters({ ...filters, carrosserie: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e]"
                >
                  <option value="" className="bg-[#0a0a0a]">Alle types</option>
                  {carrosserieen.map((type) => (
                    <option key={type} value={type} className="bg-[#0a0a0a]">{type}</option>
                  ))}
                </select>
              </div>

              {/* Brandstof */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Brandstof</label>
                <select
                  value={filters.brandstof}
                  onChange={(e) => setFilters({ ...filters, brandstof: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e]"
                >
                  <option value="" className="bg-[#0a0a0a]">Alle brandstoffen</option>
                  {brandstoffen.map((brandstof) => (
                    <option key={brandstof} value={brandstof} className="bg-[#0a0a0a]">{brandstof}</option>
                  ))}
                </select>
              </div>

              {/* Transmissie */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Transmissie</label>
                <select
                  value={filters.transmissie}
                  onChange={(e) => setFilters({ ...filters, transmissie: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e]"
                >
                  <option value="" className="bg-[#0a0a0a]">Alle transmissies</option>
                  <option value="Handmatig" className="bg-[#0a0a0a]">Handmatig</option>
                  <option value="Automaat" className="bg-[#0a0a0a]">Automaat</option>
                </select>
              </div>
            </div>

            {/* Price & Year Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Prijs: €{filters.minPrijs.toLocaleString()} - €{filters.maxPrijs.toLocaleString()}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={filters.minPrijs}
                    onChange={(e) => setFilters({ ...filters, minPrijs: parseInt(e.target.value) })}
                    className="flex-1 accent-[#c8102e]"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={filters.maxPrijs}
                    onChange={(e) => setFilters({ ...filters, maxPrijs: parseInt(e.target.value) })}
                    className="flex-1 accent-[#c8102e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Bouwjaar: {filters.minBouwjaar} - {filters.maxBouwjaar}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="2000"
                    max="2025"
                    value={filters.minBouwjaar}
                    onChange={(e) => setFilters({ ...filters, minBouwjaar: parseInt(e.target.value) })}
                    className="flex-1 accent-[#c8102e]"
                  />
                  <input
                    type="range"
                    min="2000"
                    max="2025"
                    value={filters.maxBouwjaar}
                    onChange={(e) => setFilters({ ...filters, maxBouwjaar: parseInt(e.target.value) })}
                    className="flex-1 accent-[#c8102e]"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-[#c8102e] hover:text-[#a00d24] font-medium"
                >
                  <X className="w-4 h-4" />
                  Wis alle filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-white/50">
          <span className="font-semibold text-white">{filteredCars.length}</span> occasions gevonden
        </p>
      </div>

      {/* Cars Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Geen resultaten gevonden</h3>
          <p className="text-white/50 mb-4">Pas uw filters aan of probeer een andere zoekterm.</p>
          <button
            onClick={clearFilters}
            className="text-[#c8102e] hover:text-[#a00d24] font-medium"
          >
            Wis alle filters
          </button>
        </div>
      )}
    </section>
  );
}
