import { Module } from "@nestjs/common";
import { FormPublicationController } from "./form-publication.controller";
import { FormPublicationRepository } from "./form-publication.repository";
import { FormPublicationService } from "./form-publication.service";
import { PublishedFormController } from "./published-form.controller";
import { PublishedFormRepository } from "./published-form.repository";
import { PublishedFormService } from "./published-form.service";

@Module({
  controllers: [FormPublicationController, PublishedFormController],
  providers: [
    FormPublicationRepository,
    FormPublicationService,
    PublishedFormRepository,
    PublishedFormService,
  ],
})
export class FormPublicationModule {}
