export class PublishedFormNotFoundError extends Error {
  constructor(readonly formId: string) {
    super(`No published form exists for ${formId}`);
    this.name = "PublishedFormNotFoundError";
  }
}

export class IdempotencyConflictError extends Error {
  constructor() {
    super("The idempotency key was already used for a different request");
    this.name = "IdempotencyConflictError";
  }
}

export class ConsentRecordNotFoundError extends Error {
  constructor(readonly consentRecordId: string) {
    super("The referenced consent record does not exist");
    this.name = "ConsentRecordNotFoundError";
  }
}

export class SubmissionPersistenceError extends Error {
  constructor(cause: unknown) {
    super("Submission persistence is unavailable", { cause });
    this.name = "SubmissionPersistenceError";
  }
}
