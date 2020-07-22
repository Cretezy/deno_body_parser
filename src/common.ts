import { OverLimitError } from "./errors/overLimit.ts";

const textDecoder = new TextDecoder();

export async function readToTextWithLimit(body: Deno.Reader, limit?: number) {
  const textBody = textDecoder.decode(await Deno.readAll(body));

  if (limit != null && textBody.length > limit) {
    throw new OverLimitError(limit, textBody.length);
  }

  return textBody;
}
