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
exports.UberService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
let UberService = class UberService {
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.authUrl = 'https://login.uber.com/oauth/v2/authorize';
        this.tokenUrl = 'https://login.uber.com/oauth/v2/token';
        this.apiBaseUrl = 'https://api.uber.com/v1';
        this.clientId = this.configService.get('UBER_CLIENT_ID');
        this.clientSecret = this.configService.get('UBER_CLIENT_SECRET');
        this.redirectUri = this.configService.get('UBER_REDIRECT_URI');
    }
    getAuthUrl(userId) {
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
    async exchangeCodeForTokens(code) {
        return {
            accessToken: 'mock_uber_token_' + Date.now(),
            refreshToken: 'mock_uber_refresh_' + Date.now(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };
    }
    async getUserInfo(accessToken) {
        return {
            userId: 'mock_uber_user_' + Date.now(),
            email: 'driver@uber.nl',
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
};
exports.UberService = UberService;
exports.UberService = UberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], UberService);
//# sourceMappingURL=uber.service.js.map