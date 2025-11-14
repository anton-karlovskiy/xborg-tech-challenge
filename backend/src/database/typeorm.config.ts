import { type TypeOrmModuleOptions } from "@nestjs/typeorm";

import { User } from "../user/entities/user.entity";

export const typeormConfig = (): TypeOrmModuleOptions => {
  const type = process.env.DB_TYPE;

  const synchronizeEnabled = process.env.NODE_ENV !== "production";

  if (type === "postgres") {
    return {
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || "xborg",
      entities: [User],
      synchronize: synchronizeEnabled,
    };
  }

  return {
    type: "sqlite",
    database: process.env.DB_DATABASE,
    entities: [User],
    synchronize: synchronizeEnabled,
  };
};
