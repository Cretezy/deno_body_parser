export class OverLimitError extends Error {
  constructor(limit: number, actual: number) {
    super(`Limit has been exceeded (${actual} > ${limit})`);

    Object.setPrototypeOf(this, OverLimitError.prototype);
  }
}
