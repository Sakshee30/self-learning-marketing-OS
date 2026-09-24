import { Module } from "@nestjs/common";
import { SubmissionController } from "./submission.controller";
import { SubmissionRepository } from "./submission.repository";
import { SubmissionService } from "./submission.service";

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionRepository, SubmissionService],
})
export class SubmissionModule {}
