import { Module } from "@nestjs/common";
import { ConsentModule } from "./consent/consent.module";
import { DatabaseModule } from "./database/database.module";
import { HealthController } from "./health/health.controller";
import { SubmissionModule } from "./submissions/submission.module";

@Module({
  imports: [DatabaseModule, ConsentModule, SubmissionModule],
  controllers: [HealthController],
})
export class AppModule {}
