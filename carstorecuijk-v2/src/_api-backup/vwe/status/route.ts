// app/api/vwe/status/route.ts
// API endpoint om VWE status op te halen

import { NextResponse } from 'next/server';
import { isVWEConfigured } from '@/lib/vwe-config';
import { cars } from '@/data/cars';

export async function GET() {
  // Tel VWE vs handmatige auto's
  // VWE auto's hebben meestal een specifiek ID patroon of vweId veld
  const vweCars = cars.filter(car => car.id.match(/^[a-z0-9]{20,}$/i) || car.kenteken);
  const manualCars = cars.filter(car => !vweCars.includes(car));

  return NextResponse.json({
    isConfigured: isVWEConfigured(),
    totalCars: cars.length,
    vweCars: vweCars.length,
    manualCars: manualCars.length,
    lastSync: null, // TODO: Uit cache of database halen
    timestamp: new Date().toISOString(),
  });
}
