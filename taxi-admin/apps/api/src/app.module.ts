import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { configOptions } from './config/config.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RidesModule } from './rides/rides.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { TaxReportsModule } from './tax-reports/tax-reports.module';
import { PlatformIntegrationsModule } from './platform-integrations/platform-integrations.module';
import { StripeModule } from './stripe/stripe.module';
import { AiModule } from './ai/ai.module';
import { QueueModule } from './queue/queue.module';
import { AuditModule } from './audit/audit.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    RidesModule,
    ExpensesModule,
    ReceiptsModule,
    TaxReportsModule,
    PlatformIntegrationsModule,
    StripeModule,
    AiModule,
    QueueModule,
    AuditModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
