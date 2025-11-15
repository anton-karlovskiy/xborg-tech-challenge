import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigModule } from "../config/config.module";
import { DatabaseModule } from "../database/database.module";
import { UserMicroservice } from "./user.microservice";
import { User } from "./entities/user.entity";

/**
 * Module for User microservice.
 */
@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is initialized first
    DatabaseModule, // Then DatabaseModule (which depends on ConfigService)
    TypeOrmModule.forFeature([User]), // Finally, register repositories
  ],
  controllers: [UserMicroservice],
})
export class UserMicroserviceModule {}

