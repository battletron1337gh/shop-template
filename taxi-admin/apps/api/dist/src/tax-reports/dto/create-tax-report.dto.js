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
exports.CreateTaxReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateTaxReportDto {
}
exports.CreateTaxReportDto = CreateTaxReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ReportType, description: 'Type rapport' }),
    (0, class_validator_1.IsEnum)(client_1.ReportType),
    __metadata("design:type", String)
], CreateTaxReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Jaar' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaxReportDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Kwartaal (1-4), alleen voor BTW rapporten' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], CreateTaxReportDto.prototype, "quarter", void 0);
//# sourceMappingURL=create-tax-report.dto.js.map