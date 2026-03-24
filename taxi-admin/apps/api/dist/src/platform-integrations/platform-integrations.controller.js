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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformIntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_integrations_service_1 = require("./platform-integrations.service");
const client_1 = require("@prisma/client");
let PlatformIntegrationsController = class PlatformIntegrationsController {
    constructor(platformService) {
        this.platformService = platformService;
    }
    async getConnections(req) {
        return this.platformService.getConnections(req.user.userId);
    }
    async getAuthUrl(platform, req) {
        const url = await this.platformService.getAuthUrl(platform, req.user.userId);
        return { authUrl: url };
    }
    async handleCallback(platform, code, req) {
        return this.platformService.handleCallback(platform, code, req.user.userId);
    }
    async disconnect(platform, req) {
        return this.platformService.disconnect(req.user.userId, platform);
    }
    async syncRides(platform, req, startDate, endDate) {
        return this.platformService.syncRides(req.user.userId, platform, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
};
exports.PlatformIntegrationsController = PlatformIntegrationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Alle verbindingen ophalen' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlatformIntegrationsController.prototype, "getConnections", null);
__decorate([
    (0, common_1.Get)(':platform/auth-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Auth URL ophalen' }),
    __param(0, (0, common_1.Param)('platform')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformIntegrationsController.prototype, "getAuthUrl", null);
__decorate([
    (0, common_1.Post)(':platform/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'OAuth callback verwerken' }),
    __param(0, (0, common_1.Param)('platform')),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PlatformIntegrationsController.prototype, "handleCallback", null);
__decorate([
    (0, common_1.Delete)(':platform'),
    (0, swagger_1.ApiOperation)({ summary: 'Verbinding verbreken' }),
    __param(0, (0, common_1.Param)('platform')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformIntegrationsController.prototype, "disconnect", null);
__decorate([
    (0, common_1.Post)(':platform/sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Ritten synchroniseren' }),
    __param(0, (0, common_1.Param)('platform')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], PlatformIntegrationsController.prototype, "syncRides", null);
exports.PlatformIntegrationsController = PlatformIntegrationsController = __decorate([
    (0, swagger_1.ApiTags)('Platform Integraties'),
    (0, common_1.Controller)('platform-integrations'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [platform_integrations_service_1.PlatformIntegrationsService])
], PlatformIntegrationsController);
//# sourceMappingURL=platform-integrations.controller.js.map