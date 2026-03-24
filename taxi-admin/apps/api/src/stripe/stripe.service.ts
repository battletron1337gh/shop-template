import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe | null = null;
  private isEnabled: boolean = false;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = this.configService.get('STRIPE_SECRET_KEY');
    // Check if it's a real Stripe key (not test/disabled placeholder)
    if (secretKey && !secretKey.includes('disabled') && secretKey.startsWith('sk_')) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16',
      });
      this.isEnabled = true;
    }
  }

  async createCustomer(userId: string, email: string, name: string) {
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

  private async createMockSubscription(userId: string, email: string, name: string) {
    // In development, create a mock Pro subscription directly
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

  async createCheckoutSession(userId: string, plan: 'basic' | 'pro') {
    if (!this.isEnabled || !this.stripe) {
      // In development, just update the subscription directly
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

  async createPortalSession(userId: string) {
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

  async handleWebhookEvent(event: Stripe.Event) {
    if (!this.isEnabled || !this.stripe) {
      console.log('🧪 Stripe webhook ignored in development mode');
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata.userId;
    const plan = session.metadata.plan as 'basic' | 'pro';

    await this.prisma.subscription.updateMany({
      where: { userId },
      data: {
        plan,
        status: 'active',
        stripeSubscriptionId: session.subscription as string,
      },
    });
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
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

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'past_due' },
      });
    }
  }

  private async handleSubscriptionUpdated(stripeSub: Stripe.Subscription) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSub.id },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: stripeSub.status as any,
          currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          canceledAt: stripeSub.canceled_at ? new Date(stripeSub.canceled_at * 1000) : null,
        },
      });
    }
  }

  private async handleSubscriptionCanceled(stripeSub: Stripe.Subscription) {
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

  async getSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { userId },
    });
  }

  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    if (!this.isEnabled || !this.stripe) {
      throw new Error('Stripe is not configured in development mode');
    }
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
