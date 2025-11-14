import { Controller, UnauthorizedException } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

import { User } from "../user/entities/user.entity";

/**
 * Microservice controller for handling authentication-related messages.
 */
@Controller()
export class AuthMicroservice {
  private googleClient: OAuth2Client;

  /**
   * Creates an instance of AuthMicroservice.
   *
   * @param userRepository - TypeORM repository for User entity.
   * @param jwtService - Service for JWT token operations.
   */
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /**
   * Handles Google OAuth login message.
   *
   * @param payload - Object containing idToken.
   * @returns Object containing access_token and user data.
   */
  @MessagePattern("auth.login.google")
  async loginGoogle(@Payload() payload: { idToken: string }) {
    const profile = await this.validateGoogleIdToken(payload.idToken);

    let user = await this.userRepository.findOne({ where: { googleId: profile.googleId } });

    if (!user) {
      user = this.userRepository.create(profile);
      await this.userRepository.save(user);
    }

    const access_token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return { access_token, user };
  }

  /**
   * Handles logout message (no-op for microservice, handled at gateway level).
   *
   * @returns Success message.
   */
  @MessagePattern("auth.logout")
  async logout() {
    return { message: "Logged out successfully" };
  }

  /**
   * Validates a Google ID token and extracts user profile information.
   *
   * @param idToken - Google ID token string.
   * @returns User profile object with googleId, email, firstName, lastName, and picture.
   */
  private async validateGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) {
        throw new Error("Invalid token");
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
      };
    } catch {
      throw new UnauthorizedException("Invalid Google token");
    }
  }
}

