import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UberService } from './services/uber.service';
import { BoltService } from './services/bolt.service';
import { PlatformType } from '@prisma/client';

@Injectable()
export class PlatformIntegrationsService {
  constructor(
    private prisma: PrismaService,
    private uberService: UberService,
    private boltService: BoltService,
  ) {}

  async getConnections(userId: string) {
    return this.prisma.platformConnection.findMany({
      where: { userId },
    });
  }

  async getConnection(userId: string, platform: PlatformType) {
    return this.prisma.platformConnection.findFirst({
      where: { userId, platform },
    });
  }

  async getAuthUrl(platform: PlatformType, userId: string): Promise<string> {
    switch (platform) {
      case PlatformType.uber:
        return this.uberService.getAuthUrl(userId);
      case PlatformType.bolt:
        return this.boltService.getAuthUrl(userId);
      default:
        throw new Error('Platform wordt niet ondersteund');
    }
  }

  async handleCallback(platform: PlatformType, code: string, userId: string) {
    let tokens: { accessToken: string; refreshToken: string; expiresAt: Date };
    let userInfo: { userId: string; email: string };

    switch (platform) {
      case PlatformType.uber:
        tokens = await this.uberService.exchangeCodeForTokens(code);
        userInfo = await this.uberService.getUserInfo(tokens.accessToken);
        break;
      case PlatformType.bolt:
        tokens = await this.boltService.exchangeCodeForTokens(code);
        userInfo = await this.boltService.getUserInfo(tokens.accessToken);
        break;
      default:
        throw new Error('Platform wordt niet ondersteund');
    }

    // Save or update connection
    const existing = await this.prisma.platformConnection.findFirst({
      where: { userId, platform },
    });

    if (existing) {
      return this.prisma.platformConnection.update({
        where: { id: existing.id },
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
          externalUserId: userInfo.userId,
          externalEmail: userInfo.email,
          isActive: true,
          lastSyncAt: new Date(),
        },
      });
    }

    return this.prisma.platformConnection.create({
      data: {
        userId,
        platform,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.expiresAt,
        externalUserId: userInfo.userId,
        externalEmail: userInfo.email,
      },
    });
  }

  async disconnect(userId: string, platform: PlatformType) {
    const connection = await this.prisma.platformConnection.findFirst({
      where: { userId, platform },
    });

    if (!connection) {
      throw new NotFoundException('Geen verbinding gevonden');
    }

    return this.prisma.platformConnection.update({
      where: { id: connection.id },
      data: { isActive: false },
    });
  }

  async syncRides(userId: string, platform: PlatformType, startDate?: Date, endDate?: Date) {
    const connection = await this.prisma.platformConnection.findFirst({
      where: { userId, platform, isActive: true },
    });

    if (!connection) {
      throw new NotFoundException('Geen actieve verbinding gevonden');
    }

    // Refresh token if needed
    const token = await this.getValidToken(connection);

    let rides: any[];
    switch (platform) {
      case PlatformType.uber:
        rides = await this.uberService.getTrips(token, startDate, endDate);
        break;
      case PlatformType.bolt:
        rides = await this.boltService.getTrips(token, startDate, endDate);
        break;
      default:
        throw new Error('Platform wordt niet ondersteund');
    }

    // Transform and save rides
    const transformedRides = rides.map(ride => this.transformRide(ride, platform));
    
    // Save to database
    await this.saveRides(userId, connection.id, platform, transformedRides);

    // Update last sync
    await this.prisma.platformConnection.update({
      where: { id: connection.id },
      data: { lastSyncAt: new Date() },
    });

    return { imported: rides.length };
  }

  private async getValidToken(connection: any): Promise<string> {
    // Check if token is expired and refresh if needed
    if (connection.tokenExpiresAt && new Date(connection.tokenExpiresAt) < new Date()) {
      // Refresh token logic here
      // For now, return existing token
      // In production, implement proper token refresh
    }
    return connection.accessToken;
  }

  private transformRide(ride: any, platform: PlatformType) {
    // Transform platform-specific data to our format
    switch (platform) {
      case PlatformType.uber:
        return {
          externalRideId: ride.uuid,
          rideDate: ride.request_time ? ride.request_time.split('T')[0] : ride.request_at,
          rideTime: ride.request_time ? ride.request_time.split('T')[1].substring(0, 5) : null,
          grossAmount: parseFloat(ride.fare.total_charged_to_payment_profiles?.[0]?.amount?.split(' ')[0] || 0),
          platformCommission: parseFloat(ride.fare.uber_fee?.split(' ')[0] || 0),
          netAmount: parseFloat(ride.fare.total_charged_to_payment_profiles?.[0]?.amount?.split(' ')[0] || 0) - 
                     parseFloat(ride.fare.uber_fee?.split(' ')[0] || 0),
          paymentMethod: ride.payment_method || 'card',
          distanceKm: ride.distance,
          durationMinutes: ride.duration,
          pickupAddress: ride.start_address,
          destinationAddress: ride.end_address,
        };
      case PlatformType.bolt:
        return {
          externalRideId: ride.id,
          rideDate: ride.created_at.split('T')[0],
          rideTime: ride.created_at.split('T')[1].substring(0, 5),
          grossAmount: parseFloat(ride.price),
          platformCommission: parseFloat(ride.commission || 0),
          netAmount: parseFloat(ride.price) - parseFloat(ride.commission || 0),
          paymentMethod: ride.payment_method || 'card',
          distanceKm: ride.distance / 1000, // Convert meters to km
          durationMinutes: Math.round(ride.duration / 60),
          pickupAddress: ride.pickup?.address,
          destinationAddress: ride.destination?.address,
        };
      default:
        return ride;
    }
  }

  private async saveRides(userId: string, connectionId: string, platform: PlatformType, rides: any[]) {
    for (const ride of rides) {
      const existing = await this.prisma.ride.findFirst({
        where: {
          userId,
          externalRideId: ride.externalRideId,
        },
      });

      const data = {
        userId,
        platformConnectionId: connectionId,
        platform,
        ...ride,
        syncedFromPlatform: true,
      };

      if (existing) {
        await this.prisma.ride.update({
          where: { id: existing.id },
          data,
        });
      } else {
        await this.prisma.ride.create({ data });
      }
    }
  }
}
