import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { User } from "./user/entities/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const database = configService.get<string>("DB_DATABASE");
        if (!database) {
          throw new Error("DB_DATABASE is not set in environment variables");
        }
        
        return {
          type: "sqlite",
          database,
          entities: [User],
          synchronize: true
        };
      },
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule
  ]
})

export class AppModule {}