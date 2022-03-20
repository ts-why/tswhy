/** @jsx h */

import { App } from "../components/app.tsx";
import { Main } from "../components/main.tsx";

import { getBody } from "../common.ts";
import {
  getStyleTag,
  h,
  Helmet,
  renderSSR,
  type RouterMiddleware,
} from "../deps.ts";
import { sheet } from "../styles.ts";

export const indexGet: RouterMiddleware<"/"> = (ctx) => {
  const page = renderSSR(
    <App>
      <Main />
    </App>,
  );
  ctx.response.body = getBody(Helmet.SSR(page), getStyleTag(sheet));
  ctx.response.type = "html";
};
