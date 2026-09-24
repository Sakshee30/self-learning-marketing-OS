import { Module } from "@nestjs/common";
import { FormPublicationController } from "./form-publication.controller";
import { FormPublicationRepository } from "./form-publication.repository";
import { FormPublicationService } from "./form-publication.service";

@Module({
  controllers: [FormPublicationController],
  providers: [FormPublicationRepository, FormPublicationService],
})
export class FormPublicationModule {}
