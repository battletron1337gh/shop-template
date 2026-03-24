import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Abonnementen')
@Controller('subscriptions')
@ApiBearerAuth()
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Get()
  @ApiOperation({ summary: 'Huidig abonnement ophalen' })
  async getSubscription(@Request() req) {
    return this.stripeService.getSubscription(req.user.userId);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Nieuw abonnement starten' })
  async createCheckout(@Body() body: { plan: 'basic' | 'pro' }, @Request() req) {
    return this.stripeService.createCheckoutSession(req.user.userId, body.plan);
  }

  @Post('portal')
  @ApiOperation({ summary: 'Klantenportal openen' })
  async createPortal(@Request() req) {
    return this.stripeService.createPortalSession(req.user.userId);
  }
}

@ApiTags('Stripe Webhooks')
@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(private stripeService: StripeService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(@Body() payload: Buffer, @Request() req) {
    const signature = req.headers['stripe-signature'] as string;
    const event = this.stripeService.constructEvent(payload, signature);
    await this.stripeService.handleWebhookEvent(event);
    return { received: true };
  }
}
