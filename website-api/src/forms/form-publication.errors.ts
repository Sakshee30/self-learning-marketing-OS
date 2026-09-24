export class FormPublicationPersistenceError extends Error {
  constructor(cause: unknown) {
    super("Published form version could not be persisted", { cause });
    this.name = "FormPublicationPersistenceError";
  }
}
