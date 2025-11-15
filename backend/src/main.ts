import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";

import { GatewayModule } from "./gateway/gateway.module";

/**
 * Bootstraps the API Gateway and starts the HTTP server.
 */
async function bootstrap() {
  try {
    const app = await NestFactory.create(GatewayModule);

    app.use(cookieParser());
    app.use(helmet());

    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    });

    app.setGlobalPrefix("api");

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.warn(`API Gateway is running on: http://localhost:${port}`);
  } catch (error) {
    console.error("Failed to start API Gateway:", error);
    process.exit(1);
  }
}

bootstrap();
