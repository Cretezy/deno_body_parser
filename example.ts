import { serve } from "https://deno.land/std/http/server.ts";
import {
  createBodyParser,
  JsonBodyParser,
  UrlencodedBodyParser,
} from "./mod.ts";

// Setup body parsers
const bodyParser = createBodyParser({
  parsers: [
    new JsonBodyParser(),
    new UrlencodedBodyParser(),
  ],
});

// Setup server
const server = serve(":8000");
console.log("Server running at http://localhost:8000");

// Echo server
for await (const req of server) {
  const body = await bodyParser(req);

  req.respond({
    body: JSON.stringify(body),
  });
}
