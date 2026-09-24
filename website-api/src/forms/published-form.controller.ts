import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ServiceUnavailableException,
} from "@nestjs/common";
import { formIdSchema } from "../submissions/submission.contract";
import { PublishedFormReadError } from "./published-form.errors";
import { PublishedFormService } from "./published-form.service";

@Controller("v1/forms")
export class PublishedFormController {
  constructor(private readonly forms: PublishedFormService) {}

  @Get(":formId/published-schema")
  async publishedSchema(@Param("formId") rawFormId: string) {
    const formId = formIdSchema.safeParse(rawFormId);
    if (!formId.success) {
      throw new BadRequestException({
        code: "invalid_form_id",
        message: "Invalid form identifier",
      });
    }

    try {
      const published = await this.forms.findPublished(formId.data);
      if (!published) {
        throw new NotFoundException({
          code: "form_not_published",
          message: "No published form is available",
        });
      }
      return published;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof PublishedFormReadError) {
        throw new ServiceUnavailableException({
          code: "published_form_unavailable",
          message: "Published form configuration could not be loaded",
        });
      }
      throw error;
    }
  }
}
