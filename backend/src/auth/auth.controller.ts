import {
  Body,
  Controller,
  Post,
  // ninja focus touch <
  Res,
  HttpCode,
  HttpStatus
  // ninja focus touch >
} from "@nestjs/common";
// ninja focus touch <
import { Response } from "express";
// ninja focus touch >

import { AuthService } from "./auth.service";
import { GoogleLoginDto } from "./dto/google-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login/google") // POST /auth/login/google
  // ninja focus touch <
  async loginGoogle(@Body() googleLoginDto: GoogleLoginDto, @Res() res: Response) {
    const { access_token, user } = await this.authService.loginWithGoogle(googleLoginDto.idToken);

    console.log("ninja focus touch: access_token =>", access_token);
    console.log("ninja focus touch: user =>", user);
    
    // Set httpOnly cookie with JWT token
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: isProduction, // Only send over HTTPS in production
      sameSite: isProduction ? "strict" : "lax", // CSRF protection
      maxAge: this.getCookieMaxAge(),
      path: "/"
    });

    // Return user data (token is in cookie, not response body)
    return res.json({ user });
  }
  // ninja focus touch >

  // ninja focus touch <
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {
    // Clear the access_token cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/"
    });

    return res.json({ message: "Logged out successfully" });
  }

  private getCookieMaxAge(): number {
    // Parse JWT_EXPIRES_IN (e.g., "7d", "1h", "30m")
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    
    if (!match) {
      return 24 * 60 * 60 * 1000; // Default to 1 day in milliseconds
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,           // seconds to milliseconds
      m: 60 * 1000,      // minutes to milliseconds
      h: 60 * 60 * 1000, // hours to milliseconds
      d: 24 * 60 * 60 * 1000 // days to milliseconds
    };

    return value * (multipliers[unit] || multipliers.d);
  }
  // ninja focus touch >
}