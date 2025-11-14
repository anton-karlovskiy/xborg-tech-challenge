import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AuthMicroserviceModule } from "./auth/auth-microservice.module";

/**
 * Bootstraps the Auth microservice.
 */
async function bootstrap() {
  try {
    const redisHost = process.env.REDIS_HOST || "localhost";
    const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthMicroserviceModule, {
      transport: Transport.REDIS,
      options: {
        host: redisHost,
        port: redisPort,
      },
    });

    await app.listen();
    console.warn(`Auth microservice is listening on Redis ${redisHost}:${redisPort}`);
  } catch (error) {
    console.error("Failed to start Auth microservice:", error);
    process.exit(1);
  }
}

bootstrap();

