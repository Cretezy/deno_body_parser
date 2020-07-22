import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { BodyParser } from "./src/bodyParser.ts";

export interface ICreateBodyParserOptions {
  parsers: BodyParser[];
}

export interface IParseResult {
  parser: string;
  value: any;
}

export type BodyParserRunner = (
  req: ServerRequest,
) => Promise<IParseResult | undefined>;

export function createBodyParser(
  { parsers }: ICreateBodyParserOptions,
): BodyParserRunner {
  return async (req) => {
    const contentType = req.headers.get("Content-Type");

    if (!contentType) {
      return undefined;
    }

    const parser = parsers.find((parser) => parser.canParse(contentType, req));

    if (!parser) {
      return undefined;
    }

    return {
      parser: parser.parserName,
      value: await parser.parse(req),
    };
  };
}

// Re-exports
export {
  BodyParser,
  IBodyParserOptions,
  TypeCheck,
} from "./src/bodyParser.ts";
export {
  JsonBodyParser,
  IJsonBodyParserOptions,
} from "./src/jsonParser.ts";
export {
  UrlencodedBodyParser,
  IUrlencodedBodyParserOptions,
  UrlencodedResult,
} from "./src/urlencodedParser.ts";
export { JsonStrictError } from "./src/errors/jsonStrict.ts";
export { OverLimitError } from "./src/errors/overLimit.ts";
