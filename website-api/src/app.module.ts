import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { HealthController } from "./health/health.controller";
import { SubmissionModule } from "./submissions/submission.module";

@Module({
  imports: [DatabaseModule, SubmissionModule],
  controllers: [HealthController],
})
export class AppModule {}
