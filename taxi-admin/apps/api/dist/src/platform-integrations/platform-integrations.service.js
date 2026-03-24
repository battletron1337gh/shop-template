"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformIntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uber_service_1 = require("./services/uber.service");
const bolt_service_1 = require("./services/bolt.service");
const client_1 = require("@prisma/client");
let PlatformIntegrationsService = class PlatformIntegrationsService {
    constructor(prisma, uberService, boltService) {
        this.prisma = prisma;
        this.uberService = uberService;
        this.boltService = boltService;
    }
    async getConnections(userId) {
        return this.prisma.platformConnection.findMany({
            where: { userId },
        });
    }
    async getConnection(userId, platform) {
        return this.prisma.platformConnection.findFirst({
            where: { userId, platform },
        });
    }
    async getAuthUrl(platform, userId) {
        switch (platform) {
            case client_1.PlatformType.uber:
                return this.uberService.getAuthUrl(userId);
            case client_1.PlatformType.bolt:
                return this.boltService.getAuthUrl(userId);
            default:
                throw new Error('Platform wordt niet ondersteund');
        }
    }
    async handleCallback(platform, code, userId) {
        let tokens;
        let userInfo;
        switch (platform) {
            case client_1.PlatformType.uber:
                tokens = await this.uberService.exchangeCodeForTokens(code);
                userInfo = await this.uberService.getUserInfo(tokens.accessToken);
                break;
            case client_1.PlatformType.bolt:
                tokens = await this.boltService.exchangeCodeForTokens(code);
                userInfo = await this.boltService.getUserInfo(tokens.accessToken);
                break;
            default:
                throw new Error('Platform wordt niet ondersteund');
        }
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
    async disconnect(userId, platform) {
        const connection = await this.prisma.platformConnection.findFirst({
            where: { userId, platform },
        });
        if (!connection) {
            throw new common_1.NotFoundException('Geen verbinding gevonden');
        }
        return this.prisma.platformConnection.update({
            where: { id: connection.id },
            data: { isActive: false },
        });
    }
    async syncRides(userId, platform, startDate, endDate) {
        const connection = await this.prisma.platformConnection.findFirst({
            where: { userId, platform, isActive: true },
        });
        if (!connection) {
            throw new common_1.NotFoundException('Geen actieve verbinding gevonden');
        }
        const token = await this.getValidToken(connection);
        let rides;
        switch (platform) {
            case client_1.PlatformType.uber:
                rides = await this.uberService.getTrips(token, startDate, endDate);
                break;
            case client_1.PlatformType.bolt:
                rides = await this.boltService.getTrips(token, startDate, endDate);
                break;
            default:
                throw new Error('Platform wordt niet ondersteund');
        }
        const transformedRides = rides.map(ride => this.transformRide(ride, platform));
        await this.saveRides(userId, connection.id, platform, transformedRides);
        await this.prisma.platformConnection.update({
            where: { id: connection.id },
            data: { lastSyncAt: new Date() },
        });
        return { imported: rides.length };
    }
    async getValidToken(connection) {
        if (connection.tokenExpiresAt && new Date(connection.tokenExpiresAt) < new Date()) {
        }
        return connection.accessToken;
    }
    transformRide(ride, platform) {
        switch (platform) {
            case client_1.PlatformType.uber:
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
            case client_1.PlatformType.bolt:
                return {
                    externalRideId: ride.id,
                    rideDate: ride.created_at.split('T')[0],
                    rideTime: ride.created_at.split('T')[1].substring(0, 5),
                    grossAmount: parseFloat(ride.price),
                    platformCommission: parseFloat(ride.commission || 0),
                    netAmount: parseFloat(ride.price) - parseFloat(ride.commission || 0),
                    paymentMethod: ride.payment_method || 'card',
                    distanceKm: ride.distance / 1000,
                    durationMinutes: Math.round(ride.duration / 60),
                    pickupAddress: ride.pickup?.address,
                    destinationAddress: ride.destination?.address,
                };
            default:
                return ride;
        }
    }
    async saveRides(userId, connectionId, platform, rides) {
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
            }
            else {
                await this.prisma.ride.create({ data });
            }
        }
    }
};
exports.PlatformIntegrationsService = PlatformIntegrationsService;
exports.PlatformIntegrationsService = PlatformIntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uber_service_1.UberService,
        bolt_service_1.BoltService])
], PlatformIntegrationsService);
//# sourceMappingURL=platform-integrations.service.js.map