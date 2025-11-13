import {
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

import { User } from "../user/entities/user.entity";

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) throw new UnauthorizedException("Invalid token");

      return {
        googleId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture
      };
    } catch {
      throw new UnauthorizedException("Invalid Google token");
    }
  }

  async loginWithGoogle(idToken: string) {
    const profile = await this.validateGoogleIdToken(idToken);

    let user = await this.userRepository.findOne({ where: { googleId: profile.googleId } });
    if (!user) {
      user = this.userRepository.create(profile);
      await this.userRepository.save(user);
    } else {
      // keep picture/name fresh (optional)
      Object.assign(user, {
        firstName: profile.firstName ?? user.firstName,
        lastName: profile.lastName ?? user.lastName,
        picture: profile.picture ?? user.picture
      });
      await this.userRepository.save(user);
    }

    const access_token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return { access_token, user };
  }
}