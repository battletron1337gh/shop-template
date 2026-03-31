// app/api/vwe/sync/route.ts
// API endpoint om handmatige sync te starten

import { NextRequest, NextResponse } from 'next/server';
import { syncVWE } from '@/scripts/sync-vwe';
import { isVWEConfigured } from '@/lib/vwe-config';

export async function POST(request: NextRequest) {
  console.log('🔄 Handmatige VWE sync gestart via API');

  // Check configuratie
  if (!isVWEConfigured()) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'VWE niet geconfigureerd. Controleer je .env.local bestand.' 
      },
      { status: 400 }
    );
  }

  try {
    // Start sync
    await syncVWE();
    
    return NextResponse.json({
      success: true,
      message: 'Sync succesvol afgerond',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sync fout:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Onbekende fout' 
      },
      { status: 500 }
    );
  }
}
