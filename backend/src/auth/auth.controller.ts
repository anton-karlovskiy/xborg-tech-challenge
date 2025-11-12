import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { GoogleLoginDto } from "./dto/google-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login/google") // POST /auth/login/google
  loginGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(googleLoginDto.idToken);
  }
}