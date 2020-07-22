import { ServerRequest } from "https://deno.land/std/http/server.ts";

const textEncoder = new TextEncoder();

// Mock a request (hacky but works)
export function createReq(text: string, contentType: string): ServerRequest {
  const headers = new Headers();

  headers.set("Content-Type", contentType);

  // @ts-ignore
  return { headers, body: new Deno.Buffer(textEncoder.encode(text)) };
}
