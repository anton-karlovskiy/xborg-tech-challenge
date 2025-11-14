import { Controller, NotFoundException } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { type UpdateProfileDto } from "./dto/update-profile.dto";

/**
 * Microservice controller for handling user-related messages.
 */
@Controller()
export class UserMicroservice {
  /**
   * Creates an instance of UserMicroservice.
   *
   * @param userRepository - TypeORM repository for User entity.
   */
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   * Handles read profile message.
   *
   * @param payload - Object containing userId.
   * @returns User entity object.
   */
  @MessagePattern("user.readProfile")
  async readProfile(@Payload() payload: { userId: string }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: payload.userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * Handles update profile message.
   *
   * @param payload - Object containing userId and updateProfileDto.
   * @returns Updated user entity object.
   */
  @MessagePattern("user.updateProfile")
  async updateProfile(
    @Payload() payload: { userId: string; updateProfileDto: UpdateProfileDto }
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: payload.userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    Object.assign(user, payload.updateProfileDto);
    return this.userRepository.save(user);
  }
}

