import { Injectable } from "@nestjs/common";
import {
  createRequestFingerprint,
  type SubmissionBody,
  type SubmissionReceipt,
} from "./submission.contract";
import { SubmissionRepository } from "./submission.repository";

@Injectable()
export class SubmissionService {
  constructor(private readonly repository: SubmissionRepository) {}

  submit(formId: string, body: SubmissionBody, idempotencyKey?: string): Promise<SubmissionReceipt> {
    return this.repository.accept({
      formId,
      body,
      idempotencyKey,
      requestFingerprint: createRequestFingerprint(body),
    });
  }
}
