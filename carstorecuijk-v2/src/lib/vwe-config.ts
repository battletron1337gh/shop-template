// lib/vwe-config.ts
// Configuratie voor VWE API

export const VWE_CONFIG = {
  // Deze waarden moet je invullen vanuit je VWE Developers menu
  API_KEY: process.env.VWE_API_KEY || '',
  CLIENT_ID: process.env.VWE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.VWE_CLIENT_SECRET || '',
  BASE_URL: process.env.VWE_BASE_URL || 'https://api.vwe.nl/v1',
  WEBHOOK_SECRET: process.env.VWE_WEBHOOK_SECRET || '',
};

// VWE API Endpoints (standaard, kunnen verschillen per implementatie)
export const VWE_ENDPOINTS = {
  OCCASIONS: '/occasions',
  VEHICLE: '/vehicle',
  UPLOAD: '/upload',
  WEBHOOK: '/webhook',
};

// Mapping van VWE velden naar onze website velden
export const VWE_FIELD_MAPPING = {
  // VWE veld -> Website veld
  kenteken: 'kenteken',
  merk: 'merk',
  model: 'model',
  type: 'variant',
  bouwjaar: 'bouwjaar',
  prijs: 'prijs',
  kilometerstand: 'kilometerstand',
  brandstof: 'brandstof',
  transmissie: 'transmissie',
  carrosserie: 'carrosserie',
  foto_urls: 'afbeeldingen',
  beschrijving: 'beschrijving',
  opties: 'features',
  apk: 'apk',
  status: 'status',
  vwe_id: 'vweId',
};

// Validatie schema voor inkomende VWE data
export interface VWEOccasion {
  id: string;
  kenteken: string;
  merk: string;
  model: string;
  variant?: string;
  bouwjaar: number;
  prijs: number;
  prijsadvies?: number;
  kilometerstand: number;
  brandstof: string;
  transmissie: string;
  carrosserie: string;
  foto_urls?: string[];
  beschrijving?: string;
  opties?: string[];
  apk?: string;
  status: 'beschikbaar' | 'verkocht' | 'gereserveerd' | 'verwijderd';
  created_at: string;
  updated_at: string;
}

// Check of configuratie compleet is
export function isVWEConfigured(): boolean {
  return !!(
    VWE_CONFIG.API_KEY &&
    VWE_CONFIG.CLIENT_ID &&
    VWE_CONFIG.BASE_URL
  );
}

// Helper voor error messages
export function getVWEConfigHelp(): string {
  const missing = [];
  if (!VWE_CONFIG.API_KEY) missing.push('VWE_API_KEY');
  if (!VWE_CONFIG.CLIENT_ID) missing.push('VWE_CLIENT_ID');
  if (!VWE_CONFIG.BASE_URL) missing.push('VWE_BASE_URL');
  
  if (missing.length === 0) {
    return '✅ VWE is correct geconfigureerd!';
  }
  
  return `⚠️  VWE configuratie incompleet. Ontbrekende variabelen:\n${missing.map(v => `   - ${v}`).join('\n')}\n\nVoeg deze toe aan je .env.local bestand`;
}
