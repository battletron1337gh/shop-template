// VWE API Client voor Carstore Cuijk
// Deze client communiceert met de VWE API voor occasions import/export

import { VWE_CONFIG, VWE_ENDPOINTS, VWEOccasion, isVWEConfigured, getVWEConfigHelp } from './vwe-config';

export class VWEApiClient {
  private apiKey: string;
  private clientId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = VWE_CONFIG.API_KEY;
    this.clientId = VWE_CONFIG.CLIENT_ID;
    this.baseUrl = VWE_CONFIG.BASE_URL;

    if (!isVWEConfigured()) {
      console.warn(getVWEConfigHelp());
    }
  }

  // Helper voor API calls
  private async fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Client-ID': this.clientId,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`VWE API Error (${response.status}): ${error}`);
    }

    return response.json();
  }

  // ============================================
  // OCCASIONS OPHALEN
  // ============================================

  /**
   * Haal alle occasions op van VWE
   * @param filters Optionele filters (status, merk, etc.)
   */
  async getOccasions(filters?: {
    status?: string;
    merk?: string;
    minPrijs?: number;
    maxPrijs?: number;
  }): Promise<VWEOccasion[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.merk) queryParams.append('merk', filters.merk);
    if (filters?.minPrijs) queryParams.append('min_prijs', filters.minPrijs.toString());
    if (filters?.maxPrijs) queryParams.append('max_prijs', filters.maxPrijs.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.fetch(`${VWE_ENDPOINTS.OCCASIONS}${query}`);
  }

  /**
   * Haal één specifieke occasion op via VWE ID
   */
  async getOccasionById(vweId: string): Promise<VWEOccasion> {
    return this.fetch(`${VWE_ENDPOINTS.OCCASIONS}/${vweId}`);
  }

  /**
   * Haal occasion op via kenteken (RDW lookup)
   */
  async getVehicleByLicensePlate(kenteken: string): Promise<VWEOccasion> {
    return this.fetch(`${VWE_ENDPOINTS.VEHICLE}/${kenteken}`);
  }

  // ============================================
  // OCCASIONS PUBLICEREN
  // ============================================

  /**
   * Publiceer een nieuwe occasion naar VWE
   */
  async publishOccasion(occasion: Partial<VWEOccasion>): Promise<{ id: string }> {
    return this.fetch(VWE_ENDPOINTS.OCCASIONS, {
      method: 'POST',
      body: JSON.stringify(occasion),
    });
  }

  /**
   * Update een bestaande occasion op VWE
   */
  async updateOccasion(vweId: string, updates: Partial<VWEOccasion>): Promise<void> {
    return this.fetch(`${VWE_ENDPOINTS.OCCASIONS}/${vweId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Verwijder een occasion van VWE
   */
  async deleteOccasion(vweId: string): Promise<void> {
    return this.fetch(`${VWE_ENDPOINTS.OCCASIONS}/${vweId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // FOTO'S
  // ============================================

  /**
   * Upload foto's voor een occasion
   */
  async uploadPhotos(vweId: string, photoUrls: string[]): Promise<string[]> {
    return this.fetch(`${VWE_ENDPOINTS.OCCASIONS}/${vweId}/photos`, {
      method: 'POST',
      body: JSON.stringify({ photos: photoUrls }),
    });
  }

  // ============================================
  // SYNC & WEBHOOKS
  // ============================================

  /**
   * Haal recente wijzigingen op (voor incrementele sync)
   * @param since Timestamp van laatste sync
   */
  async getChanges(since: string): Promise<VWEOccasion[]> {
    return this.fetch(`${VWE_ENDPOINTS.OCCASIONS}/changes?since=${encodeURIComponent(since)}`);
  }

  /**
   * Registreer webhook URL bij VWE
   */
  async registerWebhook(url: string, events: string[]): Promise<void> {
    return this.fetch('/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url,
        events,
        secret: VWE_CONFIG.WEBHOOK_SECRET,
      }),
    });
  }

  /**
   * Test de API connectie
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!isVWEConfigured()) {
        return { success: false, message: getVWEConfigHelp() };
      }

      // Probeer een simpele call
      await this.fetch('/health');
      return { success: true, message: '✅ VWE API connectie succesvol!' };
    } catch (error) {
      return { 
        success: false, 
        message: `❌ VWE API fout: ${error instanceof Error ? error.message : 'Onbekende fout'}` 
      };
    }
  }
}

// Singleton instance
export const vweClient = new VWEApiClient();
export default vweClient;
