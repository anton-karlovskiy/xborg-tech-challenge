import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { typeormConfig } from "./typeorm.config";

@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: typeormConfig })]
})

export class DatabaseModule {}
