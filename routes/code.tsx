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

async function fetchMarkdown(code: number): Promise<string | undefined> {
  const url = new URL(`../diagnostics/${code}.md`, import.meta.url);
  if (!(await Deno.stat(url))) {
    return;
  }
  return Deno.readTextFile(url);
}

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

export const codeGet: RouterMiddleware<"/ts:code"> = async (ctx) => {
  const code = parseInt(ctx.params.code, 10);
  const item = codeMap.get(code);
  sheet.reset();
  if (item) {
    const markdown = await fetchMarkdown(code);
    const page = renderSSR(
      <App>
        <Code item={item}>{markdown}</Code>
      </App>,
    );
    ctx.response.body = getBody(Helmet.SSR(page), getStyleTag(sheet));
    ctx.response.type = "html";
  } else {
    ctx.response.body = "Not Found";
    ctx.response.status = Status.NotFound;
  }
};
