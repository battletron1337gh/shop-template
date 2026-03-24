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
exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const expenses_service_1 = require("./expenses.service");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
const filter_expenses_dto_1 = require("./dto/filter-expenses.dto");
const common_2 = require("@nestjs/common");
let ExpensesController = class ExpensesController {
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    async findAll(req, filters) {
        return this.expensesService.findAll(req.user.userId, filters);
    }
    async getSummary(req, year, month) {
        return this.expensesService.getSummary(req.user.userId, +year, month ? +month : undefined);
    }
    async findOne(id, req) {
        return this.expensesService.findOne(id, req.user.userId);
    }
    async create(createExpenseDto, req) {
        return this.expensesService.create(req.user.userId, createExpenseDto);
    }
    async update(id, updateExpenseDto, req) {
        return this.expensesService.update(id, req.user.userId, updateExpenseDto);
    }
    async remove(id, req) {
        return this.expensesService.remove(id, req.user.userId);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Alle kosten ophalen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kosten gevonden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filter_expenses_dto_1.FilterExpensesDto]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Samenvatting kosten per periode' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Samenvatting gegenereerd' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kost ophalen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kost gevonden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kost niet gevonden' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kost toevoegen' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kost toegevoegd' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kost bijwerken' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kost bijgewerkt' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_expense_dto_1.UpdateExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kost verwijderen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kost verwijderd' }),
    __param(0, (0, common_1.Param)('id', common_2.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "remove", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, swagger_1.ApiTags)('Kosten'),
    (0, common_1.Controller)('expenses'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map