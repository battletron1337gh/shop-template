import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { FilterRidesDto } from './dto/filter-rides.dto';
import { PlatformType } from '@prisma/client';

@Injectable()
export class RidesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters: FilterRidesDto) {
    const where: any = { userId };

    if (filters.startDate) {
      where.rideDate = { gte: new Date(filters.startDate) };
    }
    
    if (filters.endDate) {
      where.rideDate = { ...where.rideDate, lte: new Date(filters.endDate) };
    }
    
    if (filters.platform) {
      where.platform = filters.platform;
    }
    
    if (filters.paymentMethod) {
      where.paymentMethod = filters.paymentMethod;
    }

    const [rides, total] = await Promise.all([
      this.prisma.ride.findMany({
        where,
        orderBy: { rideDate: 'desc' },
        skip: filters.skip || 0,
        take: filters.take || 50,
      }),
      this.prisma.ride.count({ where }),
    ]);

    return { rides, total };
  }

  async findOne(id: string, userId: string) {
    const ride = await this.prisma.ride.findFirst({
      where: { id, userId },
    });

    if (!ride) {
      throw new NotFoundException('Rit niet gevonden');
    }

    return ride;
  }

  async create(userId: string, createRideDto: CreateRideDto) {
    const grossAmount = Number(createRideDto.grossAmount);
    const commission = Number(createRideDto.platformCommission || 0);
    const netAmount = grossAmount - commission;
    
    // Calculate VAT based on vatRate
    let vatAmount = 0;
    if (createRideDto.vatRate === 'NINE') {
      vatAmount = Math.round((netAmount * 0.09) * 100) / 100;
    } else if (createRideDto.vatRate === 'TWENTY_ONE') {
      vatAmount = Math.round((netAmount * 0.21) * 100) / 100;
    }

    return this.prisma.ride.create({
      data: {
        userId,
        rideDate: new Date(createRideDto.rideDate),
        rideTime: createRideDto.rideTime ? new Date(`${createRideDto.rideDate}T${createRideDto.rideTime}`) : null,
        grossAmount: grossAmount,
        platformCommission: commission,
        netAmount: netAmount,
        vatRate: createRideDto.vatRate || 'ZERO',
        vatAmount: vatAmount,
        platform: createRideDto.platform || PlatformType.manual,
        paymentMethod: createRideDto.paymentMethod || 'card',
        description: createRideDto.description,
        distanceKm: createRideDto.distanceKm ? Number(createRideDto.distanceKm) : null,
        durationMinutes: createRideDto.durationMinutes,
        pickupAddress: createRideDto.pickupAddress,
        destinationAddress: createRideDto.destinationAddress,
        isManualEntry: true,
      },
    });
  }

  async update(id: string, userId: string, updateRideDto: UpdateRideDto) {
    const ride = await this.findOne(id, userId);

    const grossAmount = updateRideDto.grossAmount ?? Number(ride.grossAmount);
    const commission = updateRideDto.platformCommission ?? Number(ride.platformCommission);
    const netAmount = grossAmount - commission;

    return this.prisma.ride.update({
      where: { id },
      data: {
        ...updateRideDto,
        netAmount,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    
    return this.prisma.ride.delete({
      where: { id },
    });
  }

  async getSummary(userId: string, year: number, month?: number) {
    const startDate = month 
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    
    const endDate = month
      ? new Date(year, month, 0)
      : new Date(year, 11, 31);

    const [totals, byPlatform] = await Promise.all([
      this.prisma.ride.aggregate({
        where: {
          userId,
          rideDate: { gte: startDate, lte: endDate },
        },
        _sum: {
          grossAmount: true,
          platformCommission: true,
          netAmount: true,
          vatAmount: true,
        },
        _count: { id: true },
      }),
      this.prisma.ride.groupBy({
        by: ['platform'],
        where: {
          userId,
          rideDate: { gte: startDate, lte: endDate },
        },
        _sum: { netAmount: true },
        _count: { id: true },
      }),
    ]);

    return {
      totals: {
        totalGross: totals._sum.grossAmount || 0,
        totalCommission: totals._sum.platformCommission || 0,
        totalNet: totals._sum.netAmount || 0,
        totalVat: totals._sum.vatAmount || 0,
        totalRides: totals._count.id || 0,
      },
      byPlatform: byPlatform.map(p => ({
        platform: p.platform,
        amount: p._sum.netAmount || 0,
        count: p._count.id,
      })),
    };
  }

  async createManyFromPlatform(
    userId: string, 
    platformConnectionId: string, 
    platform: PlatformType,
    rides: any[]
  ) {
    const created = [];
    const updated = [];

    for (const ride of rides) {
      const existing = await this.prisma.ride.findFirst({
        where: {
          userId,
          externalRideId: ride.externalRideId,
        },
      });

      const data = {
        userId,
        platformConnectionId,
        platform,
        externalRideId: ride.externalRideId,
        rideDate: new Date(ride.rideDate),
        rideTime: ride.rideTime ? new Date(`${ride.rideDate}T${ride.rideTime}`) : null,
        grossAmount: ride.grossAmount,
        platformCommission: ride.platformCommission || 0,
        netAmount: ride.netAmount || (ride.grossAmount - (ride.platformCommission || 0)),
        vatRate: ride.vatRate || 'ZERO',
        paymentMethod: ride.paymentMethod || 'card',
        description: ride.description,
        distanceKm: ride.distanceKm,
        durationMinutes: ride.durationMinutes,
        pickupAddress: ride.pickupAddress,
        destinationAddress: ride.destinationAddress,
        syncedFromPlatform: true,
      };

      if (existing) {
        const updatedRide = await this.prisma.ride.update({
          where: { id: existing.id },
          data,
        });
        updated.push(updatedRide);
      } else {
        const createdRide = await this.prisma.ride.create({ data });
        created.push(createdRide);
      }
    }

    return { created: created.length, updated: updated.length };
  }
}
