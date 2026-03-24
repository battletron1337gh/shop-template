import { StripeService } from './stripe.service';
export declare class StripeController {
    private stripeService;
    constructor(stripeService: StripeService);
    getSubscription(req: any): Promise<{
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
    createCheckout(body: {
        plan: 'basic' | 'pro';
    }, req: any): Promise<{
        sessionId: string;
        url: string;
    }>;
    createPortal(req: any): Promise<{
        url: string;
    }>;
}
export declare class StripeWebhookController {
    private stripeService;
    constructor(stripeService: StripeService);
    handleWebhook(payload: Buffer, req: any): Promise<{
        received: boolean;
    }>;
}
