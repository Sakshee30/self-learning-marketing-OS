import { Injectable } from "@nestjs/common";
import { PublishedFormRepository } from "./published-form.repository";

@Injectable()
export class PublishedFormService {
  constructor(private readonly repository: PublishedFormRepository) {}

  findPublished(formId: string) {
    return this.repository.findPublished(formId);
  }
}
