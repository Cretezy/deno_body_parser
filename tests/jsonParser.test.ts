import { createBodyParser, JsonBodyParser } from "../mod.ts";
import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { createReq } from "./helpers.ts";
import { JsonStrictError } from "../src/errors/jsonStrict.ts";
import { OverLimitError } from "../src/errors/overLimit.ts";

Deno.test("JSON parser can parse", async () => {
  const bodyParser = createBodyParser({
    parsers: [
      new JsonBodyParser(),
    ],
  });

  assertEquals(
    await bodyParser(createReq(`{"x": 1}`, "application/json")),
    {
      parser: "json",
      value: {
        x: 1,
      },
    },
  );

  assertEquals(
    await bodyParser(createReq(`"1"`, "application/json")),
    {
      parser: "json",
      value: "1",
    },
  );

  assertEquals(
    await bodyParser(createReq(`1`, "application/json")),
    {
      parser: "json",
      value: 1,
    },
  );

  assertEquals(
    await bodyParser(createReq(`[{"x": 1}]`, "application/json")),
    {
      parser: "json",
      value: [
        { x: 1 },
      ],
    },
  );

  assertEquals(
    await bodyParser(createReq(`null`, "application/json")),
    {
      parser: "json",
      value: null,
    },
  );
});

Deno.test("JSON parser throws if over limit", async () => {
  const bodyParser = createBodyParser({
    parsers: [
      new JsonBodyParser({
        limit: 2,
      }),
    ],
  });

  const req = createReq(`{"x":1}`, "application/json");

  await assertThrowsAsync(
    async () => await bodyParser(req),
    OverLimitError,
  );
});

Deno.test("JSON parser throws on invalid JSON", async () => {
  const bodyParser = createBodyParser({
    parsers: [
      new JsonBodyParser(),
    ],
  });

  const req = createReq(`{"x":1`, "application/json");

  await assertThrowsAsync(
    async () => await bodyParser(req),
    SyntaxError,
  );
});

Deno.test("JSON parser throws if non-strict input on strict mode", async () => {
  const bodyParser = createBodyParser({
    parsers: [
      new JsonBodyParser({
        strict: true,
      }),
    ],
  });

  await assertThrowsAsync(async () =>
    await bodyParser(
      createReq(`"a"`, "application/json"),
    ), JsonStrictError);

  await assertThrowsAsync(async () =>
    await bodyParser(
      createReq(`1`, "application/json"),
    ), JsonStrictError);

  await assertThrowsAsync(async () =>
    await bodyParser(
      createReq(`null`, "application/json"),
    ), JsonStrictError);
});
