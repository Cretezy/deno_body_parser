import { BodyParser, IBodyParserOptions } from "./bodyParser.ts";
import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { readToTextWithLimit } from "./common.ts";

export interface IUrlencodedBodyParserOptions extends IBodyParserOptions {}

export type UrlencodedResult = { [key: string]: string | undefined };

/// Default type to parse is `application/x-www-form-urlencoded`.
/// Uses `URLSearchParams` for parsing. Common known as 'form'.
export class UrlencodedBodyParser<UrlencodedResult> extends BodyParser {
  defaultType = "application/x-www-form-urlencoded";
  parserName = "urlencoded";

  constructor(public readonly options?: IUrlencodedBodyParserOptions) {
    super(options);
  }

  async parse(req: ServerRequest): Promise<UrlencodedResult> {
    const textBody = await readToTextWithLimit(req.body, this.options?.limit);

    // @ts-ignore: Bug in typings (?)
    return Object.fromEntries(new URLSearchParams(textBody));
  }
}
