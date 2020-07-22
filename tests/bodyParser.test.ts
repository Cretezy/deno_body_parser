import { createBodyParser, JsonBodyParser } from "../mod.ts";
import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { createReq } from "./helpers.ts";
import { JsonStrictError } from "../src/errors/jsonStrict.ts";
import { OverLimitError } from "../src/errors/overLimit.ts";

Deno.test("Parser parses on matching type (string)", async () => {
  // Default type
  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(),
      ],
    })(createReq(`{"x": 1}`, "application/json")),
    {
      parser: "json",
      value: {
        x: 1,
      },
    },
  );

  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(
          {
            type: "application/json",
          },
        ),
      ],
    })(createReq(`{"x": 1}`, "application/json")),
    {
      parser: "json",
      value: {
        x: 1,
      },
    },
  );

  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(
          {
            type: "xxx",
          },
        ),
      ],
    })(createReq(`{"x": 1}`, "xxx")),
    {
      parser: "json",
      value: {
        x: 1,
      },
    },
  );
});

Deno.test("Parser doesn't parses on non-matching type (string)", async () => {
  // Default type
  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(),
      ],
    })(createReq(`{"x": 1}`, "xxx")),
    undefined,
  );

  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(
          {
            type: "xxx",
          },
        ),
      ],
    })(createReq(`{"x": 1}`, "application/json")),
    undefined,
  );

  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(
          {
            type: "xxx",
          },
        ),
      ],
    })(createReq(`{"x": 1}`, "yyy")),
    undefined,
  );
});

Deno.test("Parser parses on matching type (string array)", async () => {
  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(
          {
            type: ["application/json"],
          },
        ),
      ],
    })(createReq(`{"x": 1}`, "application/json")),
    {
      parser: "json",
      value: {
        x: 1,
      },
    },
  );

  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(
          {
            type: ["xxx"],
          },
        ),
      ],
    })(createReq(`{"x": 1}`, "xxx")),
    {
      parser: "json",
      value: {
        x: 1,
      },
    },
  );
});

Deno.test("Parser doesn't parses on non-matching type (string array)", async () => {
  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(
          {
            type: ["xxx"],
          },
        ),
      ],
    })(createReq(`{"x": 1}`, "application/json")),
    undefined,
  );

  assertEquals(
    await createBodyParser({
      parsers: [
        new JsonBodyParser(
          {
            type: ["xxx"],
          },
        ),
      ],
    })(createReq(`{"x": 1}`, "yyy")),
    undefined,
  );
});
