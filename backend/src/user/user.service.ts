import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { type UpdateProfileDto } from "./dto/update-profile.dto";

/**
 * Service for handling user-related business logic.
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of UserService.
   *
   * @param userRepository - TypeORM repository for User entity.
   */
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   * Retrieves a user profile by ID.
   *
   * @param id - User ID (UUID).
   * @returns User entity object.
   */
  async readProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * Updates a user's profile information.
   *
   * @param id - User ID (UUID).
   * @param updateProfileDto - DTO containing profile fields to update.
   * @returns Updated user entity object.
   */
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.readProfile(id);
    Object.assign(user, updateProfileDto);

    return this.userRepository.save(user);
  }
}
