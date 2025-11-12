import * as Joi from "joi";

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().default("development"),
  PORT: Joi.number().required(),

  DB_TYPE: Joi.string().valid("sqlite", "postgres").default("sqlite"),
  DB_DATABASE: Joi.string().required(),
  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().optional(),
  DB_USERNAME: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("1d"),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().allow("").optional(), // not strictly needed for id_token login
  FRONTEND_URL: Joi.string().required()
});
