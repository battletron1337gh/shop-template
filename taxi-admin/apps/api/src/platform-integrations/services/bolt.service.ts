import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

/**
 * Bolt API Service
 * 
 * NOTE: Bolt does not provide a public API for driver trip history.
 * This implementation uses a mock service for development purposes.
 * In production, you would need to contact Bolt for API access.
 */
@Injectable()
export class BoltService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly authUrl = 'https://bolt.eu/oauth/authorize';
  private readonly tokenUrl = 'https://bolt.eu/oauth/token';
  private readonly apiBaseUrl = 'https://bolt.eu/api/v1';

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.clientId = this.configService.get('BOLT_CLIENT_ID');
    this.clientSecret = this.configService.get('BOLT_CLIENT_SECRET');
    this.redirectUri = this.configService.get('BOLT_REDIRECT_URI');
  }

  getAuthUrl(userId: string): string {
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'driver_profile driver_trips',
      state,
    });
    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }> {
    // Mock implementation for development
    return {
      accessToken: 'mock_bolt_token_' + Date.now(),
      refreshToken: 'mock_bolt_refresh_' + Date.now(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }

  async getUserInfo(accessToken: string): Promise<{ userId: string; email: string }> {
    return {
      userId: 'mock_bolt_user_' + Date.now(),
      email: 'driver@bolt.nl',
    };
  }

  async getTrips(
    accessToken: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    return this.generateMockTrips(startDate, endDate);
  }

  private generateMockTrips(startDate?: Date, endDate?: Date): any[] {
    const trips = [];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < Math.min(days * 6, 180); i++) {
      const tripDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const price = Math.round((12 + Math.random() * 70) * 100) / 100;
      const commission = Math.round(price * 0.20 * 100) / 100;

      trips.push({
        id: `bolt_trip_${Date.now()}_${i}`,
        created_at: tripDate.toISOString(),
        price: price,
        commission: commission,
        payment_method: Math.random() > 0.4 ? 'card' : 'cash',
        distance: Math.round((1500 + Math.random() * 20000)), // meters
        duration: Math.round((8 + Math.random() * 45) * 60), // seconds
        pickup: { address: 'Rotterdam Centraal' },
        destination: { address: 'Rotterdam The Hague Airport' },
      });
    }

    return trips.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}
