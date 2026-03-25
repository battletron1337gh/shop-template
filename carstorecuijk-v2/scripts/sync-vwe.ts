// scripts/sync-vwe.ts
// Sync script om VWE occasions te importeren naar de website

import { vweClient } from '../src/lib/vwe-client';
import { VWE_CONFIG, VWEOccasion } from '../src/lib/vwe-config';
import { Car } from '../src/types';
import fs from 'fs';
import path from 'path';

// Converteer VWE occasion naar website Car formaat
function convertVWEToCar(vweAuto: VWEOccasion): Car {
  return {
    id: vweAuto.id || vweAuto.kenteken.toLowerCase().replace(/-/g, ''),
    merk: vweAuto.merk,
    model: vweAuto.model,
    variant: vweAuto.variant || '',
    bouwjaar: vweAuto.bouwjaar,
    prijs: vweAuto.prijs,
    kilometerstand: vweAuto.kilometerstand,
    brandstof: capitalize(vweAuto.brandstof),
    transmissie: capitalize(vweAuto.transmissie),
    carrosserie: capitalize(vweAuto.carrosserie),
    afbeeldingen: vweAuto.foto_urls?.length ? vweAuto.foto_urls : ['/cars/placeholder.svg'],
    status: mapStatus(vweAuto.status),
    apk: vweAuto.apk || new Date().getFullYear().toString(),
    features: vweAuto.opties || [],
    beschrijving: vweAuto.beschrijving || generateDescription(vweAuto),
    vermogen: '', // VWE levert dit vaak niet
    verbruik: '', // VWE levert dit vaak niet
  };
}

// Helper: capitalize first letter
function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Map VWE status naar onze status
function mapStatus(vweStatus: string): 'beschikbaar' | 'verkocht' | 'gereserveerd' {
  switch (vweStatus.toLowerCase()) {
    case 'beschikbaar':
    case 'active':
      return 'beschikbaar';
    case 'verkocht':
    case 'sold':
      return 'verkocht';
    case 'gereserveerd':
    case 'reserved':
      return 'gereserveerd';
    default:
      return 'beschikbaar';
  }
}

// Genereer beschrijving als VWE geen levert
function generateDescription(auto: VWEOccasion): string {
  return `Prachtige ${auto.merk} ${auto.model} uit ${auto.bouwjaar}. ` +
         `Deze ${auto.carrosserie.toLowerCase()} heeft ${auto.kilometerstand.toLocaleString('nl-NL')} km op de teller ` +
         `en rijdt op ${auto.brandstof.toLowerCase()}. ` +
         `De auto is voorzien van ${auto.transmissie.toLowerCase()} versnellingsbak. ` +
         `Kom langs voor een proefrit!`;
}

// Haal bestaande occasions op uit cars.ts
function getExistingCars(): Car[] {
  try {
    const carsPath = path.join(process.cwd(), 'src/data/cars.ts');
    const content = fs.readFileSync(carsPath, 'utf-8');
    
    // Extract de cars array (simpel parsing, kan beter met AST)
    const match = content.match(/export const cars: Car\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      // Gebruik eval voor nu (in productie beter met JSON file werken)
      return eval(match[1]);
    }
  } catch (error) {
    console.warn('Kon bestaande cars niet laden:', error);
  }
  return [];
}

// Sla occasions op naar cars.ts
function saveCars(cars: Car[]): void {
  const carsPath = path.join(process.cwd(), 'src/data/cars.ts');
  
  // Genereer nieuwe cars.ts content
  const carsArray = JSON.stringify(cars, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // Verwijder quotes om keys
    .replace(/"/g, "'"); // Vervang dubbele met enkele quotes
  
  const content = `import { Car, Service, ContactInfo, OpeningHours, Testimonial } from '@/types';

export const cars: Car[] = ${carsArray};

// ... rest van het bestand blijft hetzelfde
`;
  
  fs.writeFileSync(carsPath, content, 'utf-8');
  console.log(`💾 ${cars.length} occasions opgeslagen naar cars.ts`);
}

// Hoofd sync functie
async function syncVWE() {
  console.log('🔄 Start VWE sync...\n');

  // 1. Test connectie
  console.log('1️⃣  Test VWE API connectie...');
  const connectionTest = await vweClient.testConnection();
  console.log(connectionTest.message);
  
  if (!connectionTest.success) {
    console.error('❌ Sync afgebroken: API niet geconfigureerd');
    process.exit(1);
  }

  // 2. Haal occasions van VWE
  console.log('\n2️⃣  Ophalen occasions van VWE...');
  try {
    const vweOccasions = await vweClient.getOccasions({
      status: 'beschikbaar', // Alleen beschikbare auto's
    });
    console.log(`   ✅ ${vweOccasions.length} occasions gevonden`);

    // 3. Converteer naar website formaat
    console.log('\n3️⃣  Converteren naar website formaat...');
    const websiteCars = vweOccasions.map(convertVWEToCar);
    console.log(`   ✅ ${websiteCars.length} occasions geconverteerd`);

    // 4. Merge met bestaande (optioneel: alleen VWE auto's gebruiken)
    console.log('\n4️⃣  Samenvoegen met bestaande data...');
    const existingCars = getExistingCars();
    
    // Filter bestaande: verwijder oude VWE auto's, behoud handmatig toegevoegde
    const manualCars = existingCars.filter(car => !car.id.match(/^[a-z]{2}-\d{3}-[a-z]{2}$/i));
    
    // Combineer handmatige + nieuwe VWE auto's
    const allCars = [...manualCars, ...websiteCars];
    console.log(`   ✅ Totaal: ${allCars.length} occasions (${manualCars.length} handmatig + ${websiteCars.length} VWE)`);

    // 5. Sla op
    console.log('\n5️⃣  Opslaan...');
    saveCars(allCars);

    // 6. Build trigger (optioneel)
    console.log('\n6️⃣  Website rebuild nodig!');
    console.log('   Run: npm run build');

    console.log('\n✨ Sync succesvol afgerond!');
    
  } catch (error) {
    console.error('\n❌ Sync fout:', error);
    process.exit(1);
  }
}

// Webhook handler voor real-time updates
export async function handleVWEWebhook(event: string, data: VWEOccasion) {
  console.log(`📨 VWE Webhook ontvangen: ${event}`);
  
  switch (event) {
    case 'occasion.created':
      const newCar = convertVWEToCar(data);
      // Add to cars array and rebuild
      console.log('   Nieuwe occasion toegevoegd:', newCar.merk, newCar.model);
      break;
      
    case 'occasion.updated':
      const updatedCar = convertVWEToCar(data);
      // Update existing car
      console.log('   Occasion bijgewerkt:', updatedCar.merk, updatedCar.model);
      break;
      
    case 'occasion.deleted':
      // Remove from cars array
      console.log('   Occasion verwijderd:', data.id);
      break;
  }
  
  // Trigger rebuild
  console.log('   Website rebuild gestart...');
}

// Run sync als dit script direct wordt uitgevoerd
if (require.main === module) {
  syncVWE();
}

export { syncVWE, convertVWEToCar };
