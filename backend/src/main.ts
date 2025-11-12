import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";

import { AppModule } from "./app.module";

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not set");
}

if (!process.env.PORT) {
  throw new Error("PORT is not set");
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));
  
  const port = Number(process.env.PORT);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();