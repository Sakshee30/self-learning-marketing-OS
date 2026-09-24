import { Global, Module } from "@nestjs/common";
import { API_CONFIG, loadApiConfig } from "../config/api-config";
import { DatabasePoolService } from "./database-pool.service";

@Global()
@Module({
  providers: [
    { provide: API_CONFIG, useFactory: () => loadApiConfig() },
    DatabasePoolService,
  ],
  exports: [API_CONFIG, DatabasePoolService],
})
export class DatabaseModule {}
