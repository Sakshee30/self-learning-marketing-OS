import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Put,
  Body,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { API_CONFIG, type ApiConfig } from "../config/api-config";
import {
  formIdSchema,
  isAuthorizedCmsSync,
  publishFormVersionBodySchema,
} from "./form-publication.contract";
import { FormPublicationPersistenceError } from "./form-publication.errors";
import { FormPublicationService } from "./form-publication.service";

@Controller("v1/internal/forms")
export class FormPublicationController {
  constructor(
    private readonly forms: FormPublicationService,
    @Inject(API_CONFIG) private readonly config: ApiConfig,
  ) {}

  @Put(":formId/published-version")
  @HttpCode(HttpStatus.OK)
  async publish(
    @Param("formId") rawFormId: string,
    @Headers("authorization") authorization: string | undefined,
    @Body() rawBody: unknown,
  ) {
    if (!this.config.cmsSyncToken) {
      throw new ServiceUnavailableException({
        code: "cms_sync_unconfigured",
        message: "CMS form synchronization is not configured",
      });
    }
    if (!isAuthorizedCmsSync(authorization, this.config.cmsSyncToken)) {
      throw new UnauthorizedException({
        code: "cms_sync_unauthorized",
        message: "Valid CMS synchronization credentials are required",
      });
    }

    const formId = formIdSchema.safeParse(rawFormId);
    if (!formId.success) {
      throw new BadRequestException({ code: "invalid_form_id", message: "Invalid form identifier" });
    }

    const body = publishFormVersionBodySchema.safeParse(rawBody);
    if (!body.success) {
      throw new BadRequestException({
        code: "invalid_form_version",
        message: "Published form version is invalid",
        issues: body.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      });
    }

    try {
      return await this.forms.publish(formId.data, body.data);
    } catch (error) {
      if (error instanceof FormPublicationPersistenceError) {
        throw new ServiceUnavailableException({
          code: "form_publication_unavailable",
          message: "Published form version could not be durably synchronized",
        });
      }
      throw error;
    }
  }
}
