export class PublishedFormReadError extends Error {
  constructor(cause: unknown) {
    super("Published form schema could not be read", { cause });
    this.name = "PublishedFormReadError";
  }
}
