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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
const prisma_service_1 = require("../prisma/prisma.service");
let StripeService = class StripeService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.stripe = null;
        this.isEnabled = false;
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (secretKey && !secretKey.includes('disabled') && secretKey.startsWith('sk_')) {
            this.stripe = new stripe_1.default(secretKey, {
                apiVersion: '2023-10-16',
            });
            this.isEnabled = true;
        }
    }
    async createCustomer(userId, email, name) {
        if (!this.isEnabled || !this.stripe) {
            console.log('🧪 Stripe disabled - creating mock customer for dev');
            return this.createMockSubscription(userId, email, name);
        }
        const customer = await this.stripe.customers.create({
            email,
            name,
            metadata: { userId },
        });
        await this.prisma.subscription.create({
            data: {
                userId,
                plan: 'free',
                status: 'trialing',
                stripeCustomerId: customer.id,
                trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
        });
        return customer;
    }
    async createMockSubscription(userId, email, name) {
        const mockCustomerId = `mock_cus_${Date.now()}`;
        await this.prisma.subscription.create({
            data: {
                userId,
                plan: 'pro',
                status: 'active',
                stripeCustomerId: mockCustomerId,
                stripeSubscriptionId: `mock_sub_${Date.now()}`,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
        });
        console.log('✅ Mock Pro subscription created for development');
        return { id: mockCustomerId, email, name };
    }
    async createCheckoutSession(userId, plan) {
        if (!this.isEnabled || !this.stripe) {
            await this.prisma.subscription.updateMany({
                where: { userId },
                data: {
                    plan,
                    status: 'active',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });
            return {
                sessionId: 'mock_session_dev',
                url: `${this.configService.get('FRONTEND_URL')}/betaling/succes?session_id=mock_dev`
            };
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId },
        });
        let customerId = subscription?.stripeCustomerId;
        if (!customerId) {
            const customer = await this.createCustomer(userId, user.email, `${user.firstName} ${user.lastName}`);
            customerId = customer.id;
        }
        const priceId = plan === 'basic'
            ? this.configService.get('STRIPE_PRICE_BASIC')
            : this.configService.get('STRIPE_PRICE_PRO');
        const session = await this.stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${this.configService.get('FRONTEND_URL')}/betaling/succes?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('FRONTEND_URL')}/betaling/geannuleerd`,
            metadata: { userId, plan },
        });
        return { sessionId: session.id, url: session.url };
    }
    async createPortalSession(userId) {
        if (!this.isEnabled || !this.stripe) {
            return { url: `${this.configService.get('FRONTEND_URL')}/instellingen/abonnement` };
        }
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId },
        });
        if (!subscription?.stripeCustomerId) {
            throw new Error('Geen actief abonnement gevonden');
        }
        const session = await this.stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${this.configService.get('FRONTEND_URL')}/instellingen/abonnement`,
        });
        return { url: session.url };
    }
    async handleWebhookEvent(event) {
        if (!this.isEnabled || !this.stripe) {
            console.log('🧪 Stripe webhook ignored in development mode');
            return;
        }
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object);
                break;
            case 'invoice.paid':
                await this.handleInvoicePaid(event.data.object);
                break;
            case 'invoice.payment_failed':
                await this.handlePaymentFailed(event.data.object);
                break;
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionCanceled(event.data.object);
                break;
        }
    }
    async handleCheckoutCompleted(session) {
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;
        await this.prisma.subscription.updateMany({
            where: { userId },
            data: {
                plan,
                status: 'active',
                stripeSubscriptionId: session.subscription,
            },
        });
    }
    async handleInvoicePaid(invoice) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { stripeCustomerId: invoice.customer },
        });
        if (subscription) {
            await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: 'active',
                    currentPeriodStart: new Date(invoice.period_start * 1000),
                    currentPeriodEnd: new Date(invoice.period_end * 1000),
                },
            });
        }
    }
    async handlePaymentFailed(invoice) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { stripeCustomerId: invoice.customer },
        });
        if (subscription) {
            await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: { status: 'past_due' },
            });
        }
    }
    async handleSubscriptionUpdated(stripeSub) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { stripeSubscriptionId: stripeSub.id },
        });
        if (subscription) {
            await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: stripeSub.status,
                    currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
                    currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
                    canceledAt: stripeSub.canceled_at ? new Date(stripeSub.canceled_at * 1000) : null,
                },
            });
        }
    }
    async handleSubscriptionCanceled(stripeSub) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { stripeSubscriptionId: stripeSub.id },
        });
        if (subscription) {
            await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    plan: 'free',
                    status: 'canceled',
                    canceledAt: new Date(),
                },
            });
        }
    }
    async getSubscription(userId) {
        return this.prisma.subscription.findFirst({
            where: { userId },
        });
    }
    constructEvent(payload, signature) {
        if (!this.isEnabled || !this.stripe) {
            throw new Error('Stripe is not configured in development mode');
        }
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map