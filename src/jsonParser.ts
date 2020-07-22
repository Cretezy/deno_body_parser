import { BodyParser, IBodyParserOptions } from "./bodyParser.ts";
import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { JsonStrictError } from "./errors/jsonStrict.ts";
import { readToTextWithLimit } from "./common.ts";

/// Default type to parse is `application/json`.
/// Uses `JSON.parse` for parsing.
export interface IJsonBodyParserOptions extends IBodyParserOptions {
  /// When strict mode is enabled, it will only allow JSON arrays or objects
  /// (not string/number/null). Defaults to `false`
  strict?: boolean;
  /// The second argument passed to `JSON.parse`.
  /// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
  reviver?: (this: any, key: string, value: any) => any;
}

const strictFirstCharacters = ["[", "{"];

export class JsonBodyParser extends BodyParser {
  defaultType = "application/json";
  parserName = "json";

  constructor(public readonly options?: IJsonBodyParserOptions) {
    super(options);
  }

  async parse(req: ServerRequest) {
    const textBody = await readToTextWithLimit(req.body, this.options?.limit);

    // Do strict check (only allow objects and arrays). This is a cheap way to do pre-JSON.parse.
    if (this.options?.strict) {
      const firstCharacter = textBody.trim().charAt(0);
      if (!strictFirstCharacters.includes(firstCharacter)) {
        throw new JsonStrictError();
      }
    }

    return JSON.parse(textBody, this.options?.reviver);
  }
}
