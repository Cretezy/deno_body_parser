import {
  createBodyParser,
  JsonBodyParser,
  UrlencodedBodyParser,
} from "../mod.ts";
import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { createReq } from "./helpers.ts";
import { JsonStrictError } from "../src/errors/jsonStrict.ts";
import { OverLimitError } from "../src/errors/overLimit.ts";

Deno.test("URL encoded parser can parse", async () => {
  const bodyParser = createBodyParser({
    parsers: [
      new UrlencodedBodyParser(),
    ],
  });

  assertEquals(
    await bodyParser(createReq(`x=1`, "application/x-www-form-urlencoded")),
    {
      parser: "urlencoded",
      value: {
        x: "1",
      },
    },
  );

  assertEquals(
    await bodyParser(createReq(`x`, "application/x-www-form-urlencoded")),
    {
      parser: "urlencoded",
      value: {
        x: "",
      },
    },
  );

  // Invalid input?
  assertEquals(
    await bodyParser(createReq(`?`, "application/x-www-form-urlencoded")),
    {
      parser: "urlencoded",
      value: {},
    },
  );

  assertEquals(
    await bodyParser(createReq(`x=1&y=2`, "application/x-www-form-urlencoded")),
    {
      parser: "urlencoded",
      value: {
        x: "1",
        y: "2",
      },
    },
  );
});

Deno.test("URL encoded parser throws if over limit", async () => {
  const bodyParser = createBodyParser({
    parsers: [
      new UrlencodedBodyParser({
        limit: 2,
      }),
    ],
  });

  const req = createReq(`x=1`, "application/x-www-form-urlencoded");

  await assertThrowsAsync(
    async () => await bodyParser(req),
    OverLimitError,
  );
});
