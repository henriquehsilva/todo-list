export class HttpNotFaundError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "HttpNotFoundError";
    this.status = 404;
  }
}
