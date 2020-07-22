import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { BodyParser, TypeCheck } from "./src/bodyParser.ts";
import { IJsonBodyParserOptions, JsonBodyParser } from "./src/jsonParser.ts";
import { IUrlencodedBodyParserOptions } from "./src/urlencodedParser.ts";

export interface ICreateBodyParserOptions {
  parsers: BodyParser[];
}

export interface IParseResult {
  parser: string;
  value: any;
}

export function createBodyParser({ parsers }: ICreateBodyParserOptions) {
  return async (req: ServerRequest): Promise<IParseResult | undefined> => {
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

export { BodyParser, IBodyParserOptions, TypeCheck } from "./src/bodyParser.ts";
export { JsonBodyParser, IJsonBodyParserOptions } from "./src/jsonParser.ts";
export {
  UrlencodedBodyParser,
  IUrlencodedBodyParserOptions,
  UrlencodedResult,
} from "./src/urlencodedParser.ts";
