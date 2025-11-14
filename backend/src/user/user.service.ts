import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { type UpdateProfileDto } from "./dto/update-profile.dto";

/**
 *
 */
@Injectable()
export class UserService {
  /**
   *
   * @param userRepository
   */
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   *
   * @param id
   */
  async readProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   *
   * @param id
   * @param updateProfileDto
   */
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.readProfile(id);
    Object.assign(user, updateProfileDto);

    return this.userRepository.save(user);
  }
}
