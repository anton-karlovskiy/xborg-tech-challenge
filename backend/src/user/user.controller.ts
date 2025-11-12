import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async readProfile(@Request() req) {
    return await this.userService.readProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.userService.updateProfile(req.user.id, updateProfileDto);
  }
}