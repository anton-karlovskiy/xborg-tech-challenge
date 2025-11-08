import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: any): Promise<User> {
    const { id, emails, name, photos } = profile;
    
    let user = await this.userService.findByGoogleId(id);
    
    if (!user) {
      user = await this.userService.create({
        googleId: id,
        email: emails[0].value,
        firstName: name?.givenName || null,
        lastName: name?.familyName || null,
        picture: photos?.[0]?.value || null,
      });
    } else {
      // Update user info if it changed
      user.firstName = name?.givenName || user.firstName;
      user.lastName = name?.familyName || user.lastName;
      user.picture = photos?.[0]?.value || user.picture;
      await this.userService['userRepository'].save(user);
    }
    
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    return this.userService.findById(userId);
  }
}

