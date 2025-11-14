import { Controller, Get, Put, Body, UseGuards, Request } from "@nestjs/common";
import { type Request as ExpressRequest } from "express";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; email: string };
}

/**
 *
 */
@Controller("user")
export class UserController {
  /**
   *
   * @param userService
   */
  constructor(private readonly userService: UserService) {}

  /**
   *
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async readProfile(@Request() req: AuthenticatedRequest) {
    return await this.userService.readProfile(req.user.id);
  }

  /**
   *
   * @param req
   * @param updateProfileDto
   */
  @UseGuards(JwtAuthGuard)
  @Put("profile")
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return await this.userService.updateProfile(req.user.id, updateProfileDto);
  }
}
