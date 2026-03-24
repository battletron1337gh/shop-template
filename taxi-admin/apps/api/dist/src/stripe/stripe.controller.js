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
exports.StripeWebhookController = exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stripe_service_1 = require("./stripe.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let StripeController = class StripeController {
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    async getSubscription(req) {
        return this.stripeService.getSubscription(req.user.userId);
    }
    async createCheckout(body, req) {
        return this.stripeService.createCheckoutSession(req.user.userId, body.plan);
    }
    async createPortal(req) {
        return this.stripeService.createPortalSession(req.user.userId);
    }
};
exports.StripeController = StripeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Huidig abonnement ophalen' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Nieuw abonnement starten' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('portal'),
    (0, swagger_1.ApiOperation)({ summary: 'Klantenportal openen' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createPortal", null);
exports.StripeController = StripeController = __decorate([
    (0, swagger_1.ApiTags)('Abonnementen'),
    (0, common_1.Controller)('subscriptions'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], StripeController);
let StripeWebhookController = class StripeWebhookController {
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    async handleWebhook(payload, req) {
        const signature = req.headers['stripe-signature'];
        const event = this.stripeService.constructEvent(payload, signature);
        await this.stripeService.handleWebhookEvent(event);
        return { received: true };
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Stripe webhook endpoint' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Buffer, Object]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handleWebhook", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, swagger_1.ApiTags)('Stripe Webhooks'),
    (0, common_1.Controller)('webhooks/stripe'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], StripeWebhookController);
//# sourceMappingURL=stripe.controller.js.map