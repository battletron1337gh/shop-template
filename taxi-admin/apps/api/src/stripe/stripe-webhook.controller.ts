import { Controller, Post, Body, Headers, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Stripe Webhooks')
@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(private stripeService: StripeService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(@Req() req: Request) {
    const signature = req.headers['stripe-signature'] as string;
    const event = this.stripeService.constructEvent(req.body, signature);
    await this.stripeService.handleWebhookEvent(event);
    return { received: true };
  }
}
