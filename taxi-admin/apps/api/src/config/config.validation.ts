import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api/v1'),
  
  // Database
  DATABASE_URL: Joi.string().required(),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  
  // Redis (for BullMQ)
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
  
  // Stripe
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  STRIPE_PRICE_BASIC: Joi.string().required(),
  STRIPE_PRICE_PRO: Joi.string().required(),
  
  // OpenAI
  OPENAI_API_KEY: Joi.string().required(),
  
  // OAuth - Uber
  UBER_CLIENT_ID: Joi.string().required(),
  UBER_CLIENT_SECRET: Joi.string().required(),
  UBER_REDIRECT_URI: Joi.string().required(),
  
  // OAuth - Bolt
  BOLT_CLIENT_ID: Joi.string().required(),
  BOLT_CLIENT_SECRET: Joi.string().required(),
  BOLT_REDIRECT_URI: Joi.string().required(),
  
  // File uploads
  UPLOAD_MAX_SIZE: Joi.number().default(10485760), // 10MB
  UPLOAD_DEST: Joi.string().default('./uploads'),
  
  // Frontend URL (for CORS and redirects)
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),
});

export const configOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: ['.env.local', '.env'],
  validationSchema: configValidationSchema,
};
