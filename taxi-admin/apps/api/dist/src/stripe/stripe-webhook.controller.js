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
exports.StripeWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stripe_service_1 = require("./stripe.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let StripeWebhookController = class StripeWebhookController {
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    async handleWebhook(req) {
        const signature = req.headers['stripe-signature'];
        const event = this.stripeService.constructEvent(req.body, signature);
        await this.stripeService.handleWebhookEvent(event);
        return { received: true };
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Stripe webhook endpoint' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handleWebhook", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, swagger_1.ApiTags)('Stripe Webhooks'),
    (0, common_1.Controller)('webhooks/stripe'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], StripeWebhookController);
//# sourceMappingURL=stripe-webhook.controller.js.map