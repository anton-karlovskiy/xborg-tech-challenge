import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { type SignOptions } from "jsonwebtoken";

import { ConfigModule } from "../config/config.module";
import { JwtStrategy } from "./strategies/jwt.strategy";

/**
 * Auth module for API Gateway.
 * Provides JWT strategy for authentication guards.
 * Note: AuthMicroservice and AuthService are in AuthMicroserviceModule for microservices.
 */
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const signOptions: SignOptions = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expiresIn: process.env.JWT_EXPIRES_IN as any,
        };
        return {
          secret: process.env.JWT_SECRET,
          signOptions,
        };
      },
    }),
  ],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}
