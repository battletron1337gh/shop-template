"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configOptions = exports.configValidationSchema = void 0;
const Joi = require("joi");
exports.configValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    API_PREFIX: Joi.string().default('api/v1'),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('7d'),
    JWT_REFRESH_SECRET: Joi.string().required(),
    REDIS_URL: Joi.string().default('redis://localhost:6379'),
    STRIPE_SECRET_KEY: Joi.string().required(),
    STRIPE_WEBHOOK_SECRET: Joi.string().required(),
    STRIPE_PRICE_BASIC: Joi.string().required(),
    STRIPE_PRICE_PRO: Joi.string().required(),
    OPENAI_API_KEY: Joi.string().required(),
    UBER_CLIENT_ID: Joi.string().required(),
    UBER_CLIENT_SECRET: Joi.string().required(),
    UBER_REDIRECT_URI: Joi.string().required(),
    BOLT_CLIENT_ID: Joi.string().required(),
    BOLT_CLIENT_SECRET: Joi.string().required(),
    BOLT_REDIRECT_URI: Joi.string().required(),
    UPLOAD_MAX_SIZE: Joi.number().default(10485760),
    UPLOAD_DEST: Joi.string().default('./uploads'),
    FRONTEND_URL: Joi.string().default('http://localhost:3001'),
});
exports.configOptions = {
    isGlobal: true,
    envFilePath: ['.env.local', '.env'],
    validationSchema: exports.configValidationSchema,
};
//# sourceMappingURL=config.validation.js.map