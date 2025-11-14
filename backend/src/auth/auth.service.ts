import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

import { User } from "../user/entities/user.entity";

/**
 * Service for handling authentication logic including Google OAuth.
 */
@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  /**
   * Creates an instance of AuthService.
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
   * Validates a Google ID token and extracts user profile information.
   *
   * @param idToken - Google ID token string.
   * @returns User profile object with googleId, email, firstName, lastName, and picture.
   */
  async validateGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) {
        throw new UnauthorizedException("Invalid token");
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

  /**
   * Authenticates user with Google ID token and returns JWT access token.
   *
   * @param idToken - Google ID token string.
   * @returns Object containing access_token and user data.
   */
  async loginWithGoogle(idToken: string) {
    const profile = await this.validateGoogleIdToken(idToken);

    let user = await this.userRepository.findOne({ where: { googleId: profile.googleId } });

    if (!user) {
      user = this.userRepository.create(profile);
      await this.userRepository.save(user);
    }

    const access_token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return { access_token, user };
  }
}
