import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Security middleware
  app.use(helmet());
  app.use(compression());
  
  // CORS - sta toe vanaf laptop en mobiel
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL'),
      'http://192.168.1.8:3001',
      'http://localhost:3001',
    ],
    credentials: true,
  });
  
  // Global prefix
  const apiPrefix = configService.get('API_PREFIX');
  app.setGlobalPrefix(apiPrefix);
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Exception handling
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('TaxiBoek API')
    .setDescription('API voor het TaxiBoek boekhoudsysteem voor taxi chauffeurs')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  
  const port = configService.get('PORT');
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 TaxiBoek API draait op: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 API documentatie: http://localhost:${port}/${apiPrefix}/docs`);
  console.log(`🌐 Ook beschikbaar op: http://192.168.1.8:${port}/${apiPrefix}`);
}

bootstrap();
