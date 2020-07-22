export class JsonStrictError extends Error {
  constructor() {
    super(`Body is not object/array (JSON strict mode on)`);

    Object.setPrototypeOf(this, JsonStrictError.prototype);
  }
}
