"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.enableCors({
        origin: [
            configService.get('FRONTEND_URL'),
            'http://192.168.1.8:3001',
            'http://localhost:3001',
        ],
        credentials: true,
    });
    const apiPrefix = configService.get('API_PREFIX');
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TaxiBoek API')
        .setDescription('API voor het TaxiBoek boekhoudsysteem voor taxi chauffeurs')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
    const port = configService.get('PORT');
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 TaxiBoek API draait op: http://localhost:${port}/${apiPrefix}`);
    console.log(`📚 API documentatie: http://localhost:${port}/${apiPrefix}/docs`);
    console.log(`🌐 Ook beschikbaar op: http://192.168.1.8:${port}/${apiPrefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map