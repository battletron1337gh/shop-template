// app/api/vwe/webhook/route.ts
// Webhook endpoint voor VWE real-time updates

import { NextRequest, NextResponse } from 'next/server';
import { VWE_CONFIG } from '@/lib/vwe-config';
import { handleVWEWebhook } from '@/scripts/sync-vwe';
import crypto from 'crypto';

/**
 * Verifieer VWE webhook signature
 * VWE stuurt meestal een HMAC signature mee voor beveiliging
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) {
    console.warn('Webhook: Geen signature of secret');
    return false;
  }

  // VWE gebruikt meestal HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * POST /api/vwe/webhook
 * Ontvangt VWE webhook events
 */
export async function POST(request: NextRequest) {
  console.log('📨 VWE Webhook ontvangen');

  try {
    // 1. Haal body op
    const payload = await request.text();
    const body = JSON.parse(payload);

    // 2. Verifieer signature
    const signature = request.headers.get('x-vwe-signature') || 
                     request.headers.get('x-webhook-signature');
    
    if (VWE_CONFIG.WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(payload, signature, VWE_CONFIG.WEBHOOK_SECRET);
      if (!isValid) {
        console.error('❌ Webhook: Ongeldige signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      console.log('✅ Webhook signature geverifieerd');
    } else {
      console.warn('⚠️  Webhook secret niet geconfigureerd - signature niet gecontroleerd');
    }

    // 3. Verwerk het event
    const { event, data } = body;
    
    if (!event || !data) {
      return NextResponse.json(
        { error: 'Missing event or data' },
        { status: 400 }
      );
    }

    console.log(`📋 Event type: ${event}`);
    console.log(`🚗 Auto: ${data.merk} ${data.model} (${data.kenteken})`);

    // 4. Verwerk het event
    await handleVWEWebhook(event, data);

    // 5. Return success
    return NextResponse.json({
      success: true,
      message: `Event ${event} verwerkt`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vwe/webhook
 * Test endpoint voor webhook configuratie
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'VWE Webhook endpoint is actief',
    configured: !!VWE_CONFIG.API_KEY,
    webhookSecretConfigured: !!VWE_CONFIG.WEBHOOK_SECRET,
    supportedEvents: [
      'occasion.created',
      'occasion.updated',
      'occasion.deleted',
      'occasion.sold',
      'occasion.reserved',
    ],
    timestamp: new Date().toISOString(),
  });
}
