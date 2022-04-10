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
import diagnosticMessages from "../diagnostics/diagnosticMessages.json" assert {
  type: "json",
};
import { App } from "../components/app.tsx";
import { Code } from "../components/code.tsx";
import { type DiagnosticMessageCategory } from "../diagnostics/interfaces.d.ts";

const codeMap = new Map<
  number,
  { message: string; category: DiagnosticMessageCategory }
>();

for (
  const [message, { category, code }] of Object.entries(diagnosticMessages)
) {
  codeMap.set(code, {
    message,
    category: category as DiagnosticMessageCategory,
  });
}

export const codeGet: RouterMiddleware<"/ts:code"> = (ctx) => {
  const item = codeMap.get(parseInt(ctx.params.code, 10));
  sheet.reset();
  if (item) {
    const page = renderSSR(
      <App>
        <Code number={ctx.params.code}>{item}</Code>
      </App>,
    );
    ctx.response.body = getBody(Helmet.SSR(page), getStyleTag(sheet));
    ctx.response.type = "html";
  } else {
    ctx.response.body = "Not Found";
    ctx.response.status = Status.NotFound;
  }
};
