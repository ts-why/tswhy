/** @jsx h */

import { h } from "../deps.ts";
import { type Child, take } from "../common.ts";
import { type DiagnosticMessageCategory } from "../diagnostics/interfaces.d.ts";

export const Code = ({ children }: {
  children: Child<{
    message: string;
    category: DiagnosticMessageCategory;
  }>;
}) => {
  const item = take(children);
  return (
    <div>
      <h1>{item.message}</h1>
      <h2>{item.category}</h2>
    </div>
  );
};
