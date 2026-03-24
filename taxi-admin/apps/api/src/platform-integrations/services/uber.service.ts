import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Uber API Service
 * 
 * NOTE: Uber does not provide a public API for trip history for drivers.
 * This implementation uses a mock service for development purposes.
 * In production, you would need to use Uber's Partner API (which requires approval)
 * or implement a scraping solution with proper consent.
 */
@Injectable()
export class UberService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly authUrl = 'https://login.uber.com/oauth/v2/authorize';
  private readonly tokenUrl = 'https://login.uber.com/oauth/v2/token';
  private readonly apiBaseUrl = 'https://api.uber.com/v1';

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.clientId = this.configService.get('UBER_CLIENT_ID');
    this.clientSecret = this.configService.get('UBER_CLIENT_SECRET');
    this.redirectUri = this.configService.get('UBER_REDIRECT_URI');
  }

  getAuthUrl(userId: string): string {
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'profile history',
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
    // In production, make actual OAuth token exchange
    
    /*
    const response = await firstValueFrom(
      this.httpService.post(this.tokenUrl, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        code,
      }),
    );
    
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
    };
    */

    // Mock response for development
    return {
      accessToken: 'mock_uber_token_' + Date.now(),
      refreshToken: 'mock_uber_refresh_' + Date.now(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }

  async getUserInfo(accessToken: string): Promise<{ userId: string; email: string }> {
    /*
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiBaseUrl}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    return {
      userId: response.data.uuid,
      email: response.data.email,
    };
    */

    // Mock response
    return {
      userId: 'mock_uber_user_' + Date.now(),
      email: 'driver@uber.nl',
    };
  }

  async getTrips(
    accessToken: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    /*
    const params: any = {
      limit: 50,
    };
    if (startDate) params.start_time = startDate.toISOString();
    if (endDate) params.end_time = endDate.toISOString();

    const response = await firstValueFrom(
      this.httpService.get(`${this.apiBaseUrl}/history`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params,
      }),
    );
    return response.data.history;
    */

    // Generate mock trips for development
    return this.generateMockTrips(startDate, endDate);
  }

  private generateMockTrips(startDate?: Date, endDate?: Date): any[] {
    const trips = [];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < Math.min(days * 8, 200); i++) {
      const tripDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const grossAmount = Math.round((15 + Math.random() * 85) * 100) / 100;
      const commission = Math.round(grossAmount * 0.25 * 100) / 100;

      trips.push({
        uuid: `uber_trip_${Date.now()}_${i}`,
        request_time: tripDate.toISOString(),
        request_at: tripDate.toISOString(),
        fare: {
          total_charged_to_payment_profiles: [{ amount: `${grossAmount} EUR` }],
          uber_fee: `${commission} EUR`,
        },
        payment_method: Math.random() > 0.3 ? 'card' : 'cash',
        distance: Math.round((2 + Math.random() * 25) * 10) / 10,
        duration: Math.round(10 + Math.random() * 60),
        start_address: 'Amsterdam Centraal',
        end_address: 'Schiphol Airport',
      });
    }

    return trips.sort((a, b) => new Date(b.request_time).getTime() - new Date(a.request_time).getTime());
  }
}
