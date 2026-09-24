import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ServiceUnavailableException,
} from "@nestjs/common";
import { consentBodySchema } from "./consent.contract";
import { ConsentPersistenceError } from "./consent.errors";
import { ConsentService } from "./consent.service";

@Controller("v1/consent")
export class ConsentController {
  constructor(private readonly consent: ConsentService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async record(@Body() rawBody: unknown) {
    const body = consentBodySchema.safeParse(rawBody);
    if (!body.success) {
      throw new BadRequestException({
        code: "invalid_consent_record",
        message: "Consent record is invalid",
        issues: body.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      });
    }

    try {
      return await this.consent.record(body.data);
    } catch (error) {
      if (error instanceof ConsentPersistenceError) {
        throw new ServiceUnavailableException({
          code: "consent_unavailable",
          message: "The consent preference could not be durably recorded. Please try again.",
        });
      }
      throw error;
    }
  }
}
