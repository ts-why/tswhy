/** @jsx h */

import { h } from "../deps.ts";
import { type Child, take } from "../common.ts";

export type Category = "Error" | "Message" | "Suggestion";

export const Code = ({ children }: {
  children: Child<{
    message: string;
    category: Category;
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
