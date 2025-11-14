import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

/**
 * User module for HTTP API Gateway.
 * Note: UserMicroservice is in UserMicroserviceModule for microservices.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
