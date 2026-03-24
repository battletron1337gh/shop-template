import { Request } from 'express';
import { StripeService } from './stripe.service';
export declare class StripeWebhookController {
    private stripeService;
    constructor(stripeService: StripeService);
    handleWebhook(req: Request): Promise<{
        received: boolean;
    }>;
}
