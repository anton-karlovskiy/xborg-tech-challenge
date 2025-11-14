import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { type SignOptions } from "jsonwebtoken";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { User } from "../user/entities/user.entity";

/**
 *
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
