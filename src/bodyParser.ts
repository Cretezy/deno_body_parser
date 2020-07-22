import { ServerRequest } from "https://deno.land/std/http/server.ts";

type TypeCheckSingle =
  | string
  | RegExp
  | ((type: string, req: ServerRequest) => boolean);

export type TypeCheck = TypeCheckSingle | TypeCheckSingle[];

export interface IBodyParserOptions {
  /// Max request body size accepted. Defaults to 1MB (1 000 000 bytes)
  limit?: number;
  /// Content-Type to accept for this parser. Can be one or many strings,
  /// one or many regular expressions, or a validating function.
  /// Case-insensitive for string check (type will always be lowercase when checking RegExp/function).
  type?: TypeCheck;
}

export abstract class BodyParser<T = any> {
  abstract parserName: string;
  abstract defaultType?: TypeCheck;

  protected constructor(public readonly options?: IBodyParserOptions) {
  }

  canParse(type: string, req: ServerRequest): boolean {
    if (!this.defaultType || !type) {
      return false;
    }

    type = type.toLowerCase();

    const checkType = this.options?.type || this.defaultType;

    const checks = Array.isArray(checkType) ? checkType : [checkType];

    return checks.some((check) => {
      if (typeof check === "string") {
        return check.toLowerCase() === type;
      }

      if (check instanceof RegExp) {
        return check.test(type);
      }

      if (typeof check === "function") {
        return check(type, req);
      }
    });
  }

  /// Parsers must do their own limit check
  abstract async parse(req: ServerRequest): Promise<T>;
}
