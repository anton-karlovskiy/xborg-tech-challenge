import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { type SignOptions } from "jsonwebtoken";

import { ConfigModule } from "../config/config.module";
import { DatabaseModule } from "../database/database.module";
import { AuthMicroservice } from "./auth.microservice";
import { User } from "../user/entities/user.entity";

/**
 * Module for Auth microservice.
 */
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>("JWT_EXPIRES_IN");
        const signOptions: SignOptions = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expiresIn: expiresIn as any,
        };
        return {
          secret: configService.get<string>("JWT_SECRET"),
          signOptions,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthMicroservice],
})
export class AuthMicroserviceModule {}

