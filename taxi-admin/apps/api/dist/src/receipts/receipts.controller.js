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
exports.ReceiptsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const receipts_service_1 = require("./receipts.service");
const common_2 = require("@nestjs/common");
let ReceiptsController = class ReceiptsController {
    constructor(receiptsService) {
        this.receiptsService = receiptsService;
    }
    async findAll(req, status) {
        return this.receiptsService.findAll(req.user.userId, status);
    }
    async findOne(id, req) {
        return this.receiptsService.findOne(id, req.user.userId);
    }
    async upload(file, req) {
        return this.receiptsService.upload(req.user.userId, file);
    }
    async retryProcessing(id, req) {
        return this.receiptsService.retryProcessing(id, req.user.userId);
    }
    async remove(id, req) {
        return this.receiptsService.remove(id, req.user.userId);
    }
};
exports.ReceiptsController = ReceiptsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Alle bonnetjes ophalen' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Bonnetje ophalen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bonnetje gevonden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bonnetje niet gevonden' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Bonnetje uploaden' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)(':id/retry'),
    (0, swagger_1.ApiOperation)({ summary: 'Verwerking opnieuw proberen' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "retryProcessing", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Bonnetje verwijderen' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "remove", null);
exports.ReceiptsController = ReceiptsController = __decorate([
    (0, swagger_1.ApiTags)('Bonnetjes'),
    (0, common_1.Controller)('receipts'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [receipts_service_1.ReceiptsService])
], ReceiptsController);
//# sourceMappingURL=receipts.controller.js.map