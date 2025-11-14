import { Module } from "@nestjs/common";

import { ConfigModule } from "../config/config.module";
import { GatewayController } from "./gateway.controller";
import { AuthModule } from "../auth/auth.module";

/**
 * Gateway module that handles HTTP requests and proxies them to microservices.
 */
@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [GatewayController],
  providers: [],
})
export class GatewayModule {}

