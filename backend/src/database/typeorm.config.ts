import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { User } from "../user/entities/user.entity";

export const typeormConfig = (): TypeOrmModuleOptions => {
  const type = (process.env.DB_TYPE || "sqlite");

  if (type === "postgres") {
    return {
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || "xborg",
      entities: [User],
      synchronize: true // dev only
    };
  }

  return {
    type: "sqlite",
    database: process.env.DB_DATABASE,
    entities: [User],
    synchronize: true // dev only
  };
};
