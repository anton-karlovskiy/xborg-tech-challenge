import { type TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { User } from "../user/entities/user.entity";

export const typeormConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const type = configService.get<string>("DB_TYPE", "sqlite");
  const synchronizeEnabled = configService.get<string>("NODE_ENV", "development") !== "production";

  if (type === "postgres") {
    return {
      type: "postgres",
      host: configService.get<string>("DB_HOST"),
      port: configService.get<number>("DB_PORT", 5432),
      username: configService.get<string>("DB_USERNAME"),
      password: configService.get<string>("DB_PASSWORD"),
      database: configService.get<string>("DB_DATABASE", "xborg"),
      entities: [User],
      synchronize: synchronizeEnabled,
    };
  }

  return {
    type: "sqlite",
    database: configService.get<string>("DB_DATABASE"),
    entities: [User],
    synchronize: synchronizeEnabled,
  };
};
