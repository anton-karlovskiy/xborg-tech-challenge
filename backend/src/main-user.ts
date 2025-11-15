import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { UserMicroserviceModule } from "./user/user-microservice.module";

/**
 * Bootstraps the User microservice.
 */
async function bootstrap() {
  try {
    const redisHost = process.env.REDIS_HOST || "localhost";
    const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserMicroserviceModule, {
      transport: Transport.REDIS,
      options: {
        host: redisHost,
        port: redisPort,
      },
    });

    await app.listen();
    console.warn(`User microservice is listening on Redis ${redisHost}:${redisPort}`);
  } catch (error) {
    console.error("Failed to start User microservice:", error);
    process.exit(1);
  }
}

bootstrap();

