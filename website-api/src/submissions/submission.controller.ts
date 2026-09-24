import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  ServiceUnavailableException,
} from "@nestjs/common";
import {
  formIdSchema,
  parseIdempotencyKey,
  submissionBodySchema,
} from "./submission.contract";
import {
  ConsentRecordNotFoundError,
  IdempotencyConflictError,
  PublishedFormNotFoundError,
  SubmissionPersistenceError,
} from "./submission.errors";
import { SubmissionService } from "./submission.service";

@Controller("v1/forms")
export class SubmissionController {
  constructor(private readonly submissions: SubmissionService) {}

  @Post(":formId/submissions")
  @HttpCode(HttpStatus.ACCEPTED)
  async submit(
    @Param("formId") rawFormId: string,
    @Headers("idempotency-key") rawIdempotencyKey: string | undefined,
    @Body() rawBody: unknown,
  ) {
    const formId = formIdSchema.safeParse(rawFormId);
    if (!formId.success) {
      throw new BadRequestException({ code: "invalid_form_id", message: "Invalid form identifier" });
    }

    const body = submissionBodySchema.safeParse(rawBody);
    if (!body.success) {
      throw new BadRequestException({
        code: "invalid_submission",
        message: "Submission payload is invalid",
        issues: body.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      });
    }

    let idempotencyKey: string | undefined;
    try {
      idempotencyKey = parseIdempotencyKey(rawIdempotencyKey);
    } catch (error) {
      throw new BadRequestException({
        code: "invalid_idempotency_key",
        message: error instanceof Error ? error.message : "Invalid Idempotency-Key",
      });
    }

    try {
      return await this.submissions.submit(formId.data, body.data, idempotencyKey);
    } catch (error) {
      if (error instanceof PublishedFormNotFoundError) {
        throw new NotFoundException({ code: "form_not_published", message: "No published form is available" });
      }
      if (error instanceof IdempotencyConflictError) {
        throw new ConflictException({ code: "idempotency_conflict", message: error.message });
      }
      if (error instanceof ConsentRecordNotFoundError) {
        throw new BadRequestException({ code: "invalid_consent_reference", message: error.message });
      }
      if (error instanceof SubmissionPersistenceError) {
        throw new ServiceUnavailableException({
          code: "submission_unavailable",
          message: "The submission could not be durably accepted. Please try again.",
        });
      }
      throw error;
    }
  }
}
