import { Body, Controller, Post, Get, Put, UseGuards, Request, Res, HttpCode, HttpStatus, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Response, type Request as ExpressRequest } from "express";
import { firstValueFrom } from "rxjs";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GoogleLoginDto } from "../auth/dto/google-login.dto";
import { UpdateProfileDto } from "../user/dto/update-profile.dto";

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; email: string };
}

/**
 * API Gateway controller that proxies HTTP requests to microservices.
 */
@Controller()
export class GatewayController {
  private authClient: ClientProxy;
  private userClient: ClientProxy;

  /**
   * Creates an instance of GatewayController.
   *
   * @param configService - Configuration service for accessing environment variables.
   */
  constructor(private configService: ConfigService) {
    const redisHost = this.configService.get<string>("REDIS_HOST", "localhost");
    const redisPort = this.configService.get<number>("REDIS_PORT", 6379);

    this.authClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: redisHost,
        port: redisPort,
      },
    });

    this.userClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: redisHost,
        port: redisPort,
      },
    });
  }

  /**
   * Handles Google OAuth login and sets JWT token in httpOnly cookie.
   *
   * @param googleLoginDto - DTO containing Google ID token.
   * @param res - Express response object for setting cookies.
   * @returns User data object.
   */
  @Post("auth/login/google")
  async loginGoogle(@Body() googleLoginDto: GoogleLoginDto, @Res() res: Response) {
    try {
      const result = await firstValueFrom(
        this.authClient.send("auth.login.google", { idToken: googleLoginDto.idToken })
      );

      // Set httpOnly cookie with JWT token
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("access_token", result.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: this.getCookieMaxAge(),
        path: "/",
      });

      return res.json({ user: result.user });
    } catch (error) {
      throw new UnauthorizedException("Authentication failed");
    }
  }

  /**
   * Handles user logout by clearing the JWT cookie.
   *
   * @param res - Express response object for clearing cookies.
   * @returns Success message object.
   */
  @Post("auth/logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    await firstValueFrom(this.authClient.send("auth.logout", {}));

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    return res.json({ message: "Logged out successfully" });
  }

  /**
   * Retrieves the current user's profile.
   *
   * @param req - Authenticated request containing user information.
   * @returns User profile object.
   */
  @UseGuards(JwtAuthGuard)
  @Get("user/profile")
  async readProfile(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.userClient.send("user.readProfile", { userId: req.user.id })
      );
    } catch (error) {
      if (error.message === "User not found") {
        throw new NotFoundException("User not found");
      }
      throw error;
    }
  }

  /**
   * Updates the current user's profile.
   *
   * @param req - Authenticated request containing user information.
   * @param updateProfileDto - DTO containing profile fields to update.
   * @returns Updated user profile object.
   */
  @UseGuards(JwtAuthGuard)
  @Put("user/profile")
  async updateProfile(@Request() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    try {
      return await firstValueFrom(
        this.userClient.send("user.updateProfile", {
          userId: req.user.id,
          updateProfileDto,
        })
      );
    } catch (error) {
      if (error.message === "User not found") {
        throw new NotFoundException("User not found");
      }
      throw error;
    }
  }

  /**
   * Calculates cookie max age in milliseconds based on JWT_EXPIRES_IN environment variable.
   *
   * @returns Cookie max age in milliseconds.
   */
  private getCookieMaxAge(): number {
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const match = expiresIn.match(/^(\d+)([dhms])$/);

    if (!match) {
      return 24 * 60 * 60 * 1000; // Default to 1 day in milliseconds
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] || multipliers.d);
  }
}

