export interface Car {
  id: string;
  merk: string;
  model: string;
  variant: string;
  bouwjaar: number;
  carrosserie: string;
  brandstof: string;
  transmissie: string;
  kilometerstand: number;
  prijs: number;
  afbeeldingen: string[];
  status: 'beschikbaar' | 'gereserveerd' | 'verkocht';
  apk: string;
  features: string[];
  beschrijving: string;
  verbruik?: string;
  vermogen?: string;
  co2?: string;
  kenteken?: string; // VWE koppeling
  vweId?: string; // VWE uniek ID
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price?: number;
}

export interface OpeningHours {
  dag: string;
  opening: string;
  sluiting: string;
}

export interface ContactInfo {
  adres: string;
  postcode: string;
  plaats: string;
  telefoon: string;
  email: string;
  whatsapp: string;
}

export interface Testimonial {
  id: string;
  naam: string;
  beoordeling: string;
  sterren: number;
  datum: string;
  auto?: string;
}
