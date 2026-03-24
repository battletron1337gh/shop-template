import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
export declare class StripeService {
    private configService;
    private prisma;
    private stripe;
    private isEnabled;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCustomer(userId: string, email: string, name: string): Promise<{
        id: string;
        email: string;
        name: string;
    } | Stripe.Response<Stripe.Customer>>;
    private createMockSubscription;
    createCheckoutSession(userId: string, plan: 'basic' | 'pro'): Promise<{
        sessionId: string;
        url: string;
    }>;
    createPortalSession(userId: string): Promise<{
        url: string;
    }>;
    handleWebhookEvent(event: Stripe.Event): Promise<void>;
    private handleCheckoutCompleted;
    private handleInvoicePaid;
    private handlePaymentFailed;
    private handleSubscriptionUpdated;
    private handleSubscriptionCanceled;
    getSubscription(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
        stripePriceId: string | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        trialEndsAt: Date | null;
        canceledAt: Date | null;
    }>;
    constructEvent(payload: Buffer, signature: string): Stripe.Event;
}
