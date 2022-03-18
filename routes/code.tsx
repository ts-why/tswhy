/** @jsx h */
import { getBody } from "../common.ts";
import {
  getStyleTag,
  h,
  Helmet,
  renderSSR,
  type RouterMiddleware,
  Status,
} from "../deps.ts";
import { sheet } from "../styles.ts";
import diagnosticMessages from "../static/diagnosticMessages.json" assert {
  type: "json",
};
import { App } from "../components/App.tsx";
import { Category, Code } from "../components/Code.tsx";

const codeMap = new Map<number, { message: string; category: Category }>();

for (
  const [message, { category, code }] of Object.entries(diagnosticMessages)
) {
  codeMap.set(code, { message, category: category as Category });
}

export const codeGet: RouterMiddleware<"/code/:code"> = (ctx) => {
  const item = codeMap.get(parseInt(ctx.params.code, 10));
  sheet.reset();
  if (item) {
    const page = renderSSR(
      <App>
        <Code>{item}</Code>
      </App>,
    );
    ctx.response.body = getBody(Helmet.SSR(page), getStyleTag(sheet));
    ctx.response.type = "html";
  } else {
    ctx.response.body = "Not Found";
    ctx.response.status = Status.NotFound;
  }
};
