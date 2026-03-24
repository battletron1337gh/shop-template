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
exports.BoltService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
let BoltService = class BoltService {
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.authUrl = 'https://bolt.eu/oauth/authorize';
        this.tokenUrl = 'https://bolt.eu/oauth/token';
        this.apiBaseUrl = 'https://bolt.eu/api/v1';
        this.clientId = this.configService.get('BOLT_CLIENT_ID');
        this.clientSecret = this.configService.get('BOLT_CLIENT_SECRET');
        this.redirectUri = this.configService.get('BOLT_REDIRECT_URI');
    }
    getAuthUrl(userId) {
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
    async exchangeCodeForTokens(code) {
        return {
            accessToken: 'mock_bolt_token_' + Date.now(),
            refreshToken: 'mock_bolt_refresh_' + Date.now(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };
    }
    async getUserInfo(accessToken) {
        return {
            userId: 'mock_bolt_user_' + Date.now(),
            email: 'driver@bolt.nl',
        };
    }
    async getTrips(accessToken, startDate, endDate) {
        return this.generateMockTrips(startDate, endDate);
    }
    generateMockTrips(startDate, endDate) {
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
                distance: Math.round((1500 + Math.random() * 20000)),
                duration: Math.round((8 + Math.random() * 45) * 60),
                pickup: { address: 'Rotterdam Centraal' },
                destination: { address: 'Rotterdam The Hague Airport' },
            });
        }
        return trips.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
};
exports.BoltService = BoltService;
exports.BoltService = BoltService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], BoltService);
//# sourceMappingURL=bolt.service.js.map