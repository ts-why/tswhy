import { Application, colors, HttpError, Router, Status } from "./deps.ts";
import { logging, timing } from "./middleware/logging.ts";
import { indexGet } from "./routes/index.tsx";
import diagnosticMessages from "./static/diagnosticMessages.json" assert {
  type: "json",
};

type Category = "Error" | "Message" | "Suggestion";

const codeMap = new Map<number, { message: string; category: Category }>();

for (
  const [message, { category, code }] of Object.entries(diagnosticMessages)
) {
  codeMap.set(code, { message, category: category as Category });
}

const router = new Router();

router.get("/", indexGet);

router.get("/code/:code", (ctx) => {
  const item = codeMap.get(parseInt(ctx.params.code, 10));
  if (item) {
    ctx.response.body = item.message;
  } else {
    ctx.response.body = "Not Found";
    ctx.response.status = Status.NotFound;
  }
});

const app = new Application();

app.use(logging);
app.use(timing);

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ secure, hostname, port }) => {
  console.log(
    `${colors.yellow("Listening on")}: ${
      secure ? "https" : "http"
    }://${hostname}:${port}/`,
  );
});

app.addEventListener("error", (evt) => {
  let msg = `[${colors.red("error")}] `;
  if (evt.error instanceof Error) {
    msg += `${evt.error.name}: ${evt.error.message}`;
  } else {
    msg += Deno.inspect(evt.error);
  }
  if (
    (evt.error instanceof HttpError && evt.error.status >= 400 &&
      evt.error.status <= 499)
  ) {
    if (evt.context) {
      msg += `\n\nrequest:\n  url: ${evt.context.request.url}\n  headers: ${
        Deno.inspect([...evt.context.request.headers])
      }\n`;
    }
  }
  if (evt.error instanceof Error && evt.error.stack) {
    const stack = evt.error.stack.split("\n");
    stack.shift();
    msg += `\n\n${stack.join("\n")}\n`;
  }
  console.error(msg);
});

if (Deno.env.get("DENO_DEPLOYMENT_ID") || Deno.mainModule === import.meta.url) {
  app.listen({ port: 8080 });
}
