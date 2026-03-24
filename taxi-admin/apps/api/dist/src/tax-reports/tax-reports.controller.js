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
exports.TaxReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tax_reports_service_1 = require("./tax-reports.service");
const create_tax_report_dto_1 = require("./dto/create-tax-report.dto");
const common_2 = require("@nestjs/common");
let TaxReportsController = class TaxReportsController {
    constructor(taxReportsService) {
        this.taxReportsService = taxReportsService;
    }
    async findAll(req) {
        return this.taxReportsService.findAll(req.user.userId);
    }
    async getBtwOverview(req, year) {
        return this.taxReportsService.getBtwOverview(req.user.userId, +year);
    }
    async getAnnualSummary(req, year) {
        return this.taxReportsService.getAnnualSummary(req.user.userId, +year);
    }
    async findOne(id, req) {
        return this.taxReportsService.findOne(id, req.user.userId);
    }
    async create(createDto, req) {
        return this.taxReportsService.create(req.user.userId, createDto);
    }
};
exports.TaxReportsController = TaxReportsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Alle rapporten ophalen' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaxReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('btw-overview'),
    (0, swagger_1.ApiOperation)({ summary: 'BTW overzicht per kwartaal' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], TaxReportsController.prototype, "getBtwOverview", null);
__decorate([
    (0, common_1.Get)('annual-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Jaaroverzicht' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], TaxReportsController.prototype, "getAnnualSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Rapport ophalen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rapport gevonden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rapport niet gevonden' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TaxReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Rapport aanmaken' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rapport aangemaakt' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tax_report_dto_1.CreateTaxReportDto, Object]),
    __metadata("design:returntype", Promise)
], TaxReportsController.prototype, "create", null);
exports.TaxReportsController = TaxReportsController = __decorate([
    (0, swagger_1.ApiTags)('Belastingrapporten'),
    (0, common_1.Controller)('tax-reports'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [tax_reports_service_1.TaxReportsService])
], TaxReportsController);
//# sourceMappingURL=tax-reports.controller.js.map