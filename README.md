# Deno Body Parser

Generic body parser for Deno's `ServerRequest` body.

**Features**:

- Multiple input types: JSON, URL encoded
- Custom Content-Type checks (strings/RegExps/functions)
- Limit checks
- Generalized (can be used with/by any framework) and well tested

## Example

```ts
import { createBodyParser, JsonBodyParser } from "https://deno.land/x/body_parser/mod.ts";

const bodyParser = createBodyParser({
  parsers: [new JsonBodyParser()],
});

// ...

// Request with Content-Type of application/json with {"x": 1}

const results = await bodyParser(req);

assertEquals(results, {
  parser: "json",
  value: {
    x: 1,
  },
});
```

[View full example](./example.ts)

## Usage

### `createBodyParser`

Creates the body parser using a list a parsers as an option.
The created body parser accepts a `ServerRequest` from Deno's HTTP server, and returns `undefined`
if no suitable parser is found (based on `Content-Type`), or an object of `{ parser: string, value: any}`
if one was found.

All parsers accept the follow options:

- `limit`: The limit in bytes of body to parser
- `type`: One of many strings, RegExps, of functions to check if the `Content-Type` is suitable for the parser

### Built-in parsers

#### `JsonBodyParser` (`json`)

A parser for JSON requests using `application/json`.

Accepts the follow options (includiong the default ones listed above):

- `strict`: If enabled, only objects/arrays will be allowed to be parsed. Defaults to `false
- `reviver`: The second argument to `JSON.parse`. You shouldn't need this. [Read more about revivers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

#### `UrlencodedBodyParser` (`urlencoded`)

A parser for form requests using `application/x-www-form-urlencoded`.

### Custom parsers

You can implement your own parsers by extending `BodyParser`. You can see examples for the [JSON parser](./src/jsonParser.ts) or [URL encoded parser](./src/urlencodedParser.ts).

## Support

Since Deno is evolving quickly, only the latest version is officially supported.

Please file feature requests and bugs at the [issue tracker](https://github.com/Cretezy/deno_body_parser/issues).
