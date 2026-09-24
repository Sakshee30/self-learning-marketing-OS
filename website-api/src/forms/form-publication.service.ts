import { Injectable } from "@nestjs/common";
import type { PublishFormVersionBody } from "./form-publication.contract";
import { FormPublicationRepository } from "./form-publication.repository";

@Injectable()
export class FormPublicationService {
  constructor(private readonly repository: FormPublicationRepository) {}

  publish(formId: string, body: PublishFormVersionBody) {
    return this.repository.publish(formId, body);
  }
}
