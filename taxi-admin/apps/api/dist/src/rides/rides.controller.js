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
exports.RidesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rides_service_1 = require("./rides.service");
const create_ride_dto_1 = require("./dto/create-ride.dto");
const update_ride_dto_1 = require("./dto/update-ride.dto");
const filter_rides_dto_1 = require("./dto/filter-rides.dto");
const common_2 = require("@nestjs/common");
let RidesController = class RidesController {
    constructor(ridesService) {
        this.ridesService = ridesService;
    }
    async findAll(req, filters) {
        return this.ridesService.findAll(req.user.userId, filters);
    }
    async getSummary(req, year, month) {
        return this.ridesService.getSummary(req.user.userId, +year, month ? +month : undefined);
    }
    async findOne(id, req) {
        return this.ridesService.findOne(id, req.user.userId);
    }
    async create(createRideDto, req) {
        try {
            return await this.ridesService.create(req.user.userId, createRideDto);
        }
        catch (error) {
            console.error('❌ ERROR creating ride:', error);
            throw error;
        }
    }
    async update(id, updateRideDto, req) {
        return this.ridesService.update(id, req.user.userId, updateRideDto);
    }
    async remove(id, req) {
        return this.ridesService.remove(id, req.user.userId);
    }
};
exports.RidesController = RidesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Alle ritten ophalen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ritten gevonden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filter_rides_dto_1.FilterRidesDto]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Samenvatting ritten per periode' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Samenvatting gegenereerd' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Rit ophalen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rit gevonden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rit niet gevonden' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Rit toevoegen' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rit toegevoegd' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ride_dto_1.CreateRideDto, Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Rit bijwerken' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rit bijgewerkt' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ride_dto_1.UpdateRideDto, Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Rit verwijderen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rit verwijderd' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "remove", null);
exports.RidesController = RidesController = __decorate([
    (0, swagger_1.ApiTags)('Ritten'),
    (0, common_1.Controller)('rides'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [rides_service_1.RidesService])
], RidesController);
//# sourceMappingURL=rides.controller.js.map