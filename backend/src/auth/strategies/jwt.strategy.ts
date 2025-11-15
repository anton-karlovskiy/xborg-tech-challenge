import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { type Request } from "express";

/**
 * JWT authentication strategy for Passport.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   *
   * @param configService - Configuration service for accessing environment variables.
   */
  constructor(private configService: ConfigService) {
    super({
      secretOrKey: configService.get<string>("JWT_SECRET"),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try to extract from cookie
        (request: Request) => {
          return request?.cookies?.access_token || null;
        },
        // Fallback to Authorization header for backward compatibility
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    });
  }

  /**
   * Validates JWT payload and returns user information.
   *
   * @param payload - JWT payload containing user ID and email.
   * @param payload.sub - User ID from JWT subject claim.
   * @param payload.email - User email from JWT payload.
   * @returns User object with id and email.
   */
  async validate(payload: { sub: string; email: string }) {
    return { id: payload.sub, email: payload.email };
  }
}
