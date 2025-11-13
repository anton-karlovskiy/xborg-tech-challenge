import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
// ninja focus touch <
import * as cookieParser from "cookie-parser";
// ninja focus touch >
import helmet from "helmet";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ninja focus touch <
  app.use(cookieParser());
  // ninja focus touch >
  app.use(helmet());
  
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  });
  
  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));
  
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();