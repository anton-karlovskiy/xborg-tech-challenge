import { Controller, Get, Put, Body, UseGuards, Request } from "@nestjs/common";
import { type Request as ExpressRequest } from "express";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; email: string };
}

/**
 * Controller for handling user profile operations.
 */
@Controller("user")
export class UserController {
  /**
   * Creates an instance of UserController.
   *
   * @param userService - The user service instance.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves the current user's profile.
   *
   * @param req - Authenticated request containing user information.
   * @returns User profile object.
   */
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async readProfile(@Request() req: AuthenticatedRequest) {
    return await this.userService.readProfile(req.user.id);
  }

  /**
   * Updates the current user's profile.
   *
   * @param req - Authenticated request containing user information.
   * @param updateProfileDto - DTO containing profile fields to update.
   * @returns Updated user profile object.
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
