import { colors, type Middleware } from "../deps.ts";

export const logging: Middleware = async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  const c = ctx.response.status >= 500
    ? colors.red
    : ctx.response.status >= 400
    ? colors.yellow
    : colors.green;
  console.log(
    `${c(ctx.request.method)} ${colors.gray(`(${ctx.response.status})`)} - ${
      colors.cyan(`${ctx.request.url.pathname}${ctx.request.url.search}`)
    } - ${colors.bold(String(rt))}`,
  );
};

export const timing: Middleware = async (ctx, next) => {
  performance.mark("start");
  await next();
  const measure = performance.measure("handle time", {
    start: "start",
  });
  ctx.response.headers.set(
    "X-Response-Time",
    `${measure.duration.toFixed(2)}ms`,
  );
};
