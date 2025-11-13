import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
// ninja focus touch <
import { Request } from "express";
// ninja focus touch >

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      // ninja focus touch <
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try to extract from cookie
        (request: Request) => {
          return request?.cookies?.access_token || null;
        },
        // Fallback to Authorization header for backward compatibility
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ])
      // ninja focus touch >
    });
  }

  async validate(payload: { sub: string; email: string; }) {
    return { id: payload.sub, email: payload.email };
  }
}