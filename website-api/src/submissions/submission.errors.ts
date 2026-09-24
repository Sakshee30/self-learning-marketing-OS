export class PublishedFormNotFoundError extends Error {
  constructor(formId: string) {
    super(`No published form version exists for "${formId}"`);
    this.name = "PublishedFormNotFoundError";
  }
}

export class PublishedFormVersionNotFoundError extends Error {
  constructor(formVersionId: string) {
    super(`Form version "${formVersionId}" is not available for this form`);
    this.name = "PublishedFormVersionNotFoundError";
  }
}

export class IdempotencyConflictError extends Error {
  constructor() {
    super("Idempotency-Key was already used for a different submission");
    this.name = "IdempotencyConflictError";
  }
}

export class ConsentRecordNotFoundError extends Error {
  constructor(consentRecordId: string) {
    super(`Consent record "${consentRecordId}" does not exist`);
    this.name = "ConsentRecordNotFoundError";
  }
}

export class SubmissionFormValidationError extends Error {
  constructor(
    readonly issues: Array<{ field: string; message: string }>,
  ) {
    super("Submission does not satisfy the published form version");
    this.name = "SubmissionFormValidationError";
  }
}

export class SubmissionPersistenceError extends Error {
  constructor(cause: unknown) {
    super("Submission could not be durably accepted", { cause });
    this.name = "SubmissionPersistenceError";
  }
}
