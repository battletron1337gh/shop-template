"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const config_validation_1 = require("./config/config.validation");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const rides_module_1 = require("./rides/rides.module");
const expenses_module_1 = require("./expenses/expenses.module");
const receipts_module_1 = require("./receipts/receipts.module");
const tax_reports_module_1 = require("./tax-reports/tax-reports.module");
const platform_integrations_module_1 = require("./platform-integrations/platform-integrations.module");
const stripe_module_1 = require("./stripe/stripe.module");
const ai_module_1 = require("./ai/ai.module");
const queue_module_1 = require("./queue/queue.module");
const audit_module_1 = require("./audit/audit.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const throttler_1 = require("@nestjs/throttler");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(config_validation_1.configOptions),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            rides_module_1.RidesModule,
            expenses_module_1.ExpensesModule,
            receipts_module_1.ReceiptsModule,
            tax_reports_module_1.TaxReportsModule,
            platform_integrations_module_1.PlatformIntegrationsModule,
            stripe_module_1.StripeModule,
            ai_module_1.AiModule,
            queue_module_1.QueueModule,
            audit_module_1.AuditModule,
            dashboard_module_1.DashboardModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map