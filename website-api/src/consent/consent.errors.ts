export class ConsentPersistenceError extends Error {
  constructor(cause: unknown) {
    super("Consent persistence is unavailable", { cause });
    this.name = "ConsentPersistenceError";
  }
}
