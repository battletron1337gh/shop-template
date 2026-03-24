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
exports.CreateRideDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateRideDto {
}
exports.CreateRideDto = CreateRideDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Datum van de rit' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "rideDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tijd van de rit' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "rideTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bruto bedrag' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRideDto.prototype, "grossAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Platform commissie' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRideDto.prototype, "platformCommission", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PlatformType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PlatformType),
    __metadata("design:type", String)
], CreateRideDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PaymentMethod, default: client_1.PaymentMethod.card }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], CreateRideDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.VatRate, default: client_1.VatRate.ZERO }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VatRate),
    __metadata("design:type", String)
], CreateRideDto.prototype, "vatRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Afstand in kilometers' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRideDto.prototype, "distanceKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duur in minuten' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRideDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "pickupAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRideDto.prototype, "destinationAddress", void 0);
//# sourceMappingURL=create-ride.dto.js.map