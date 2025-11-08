import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/google')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    // This endpoint receives the Google ID token from the frontend
    // and validates it, then creates/updates the user and returns JWT
    
    try {
      // In a production app, you should verify the ID token with Google
      // For this implementation, we'll use a simplified approach
      // The frontend sends the user profile data after Google authentication
      
      const user = await this.authService.validateGoogleUser({
        id: googleLoginDto.googleId,
        emails: [{ value: googleLoginDto.email }],
        name: {
          givenName: googleLoginDto.firstName,
          familyName: googleLoginDto.lastName,
        },
        photos: googleLoginDto.picture ? [{ value: googleLoginDto.picture }] : [],
      });
      
      return this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }
}

