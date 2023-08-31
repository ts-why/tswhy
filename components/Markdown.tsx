import { render } from "gfm";
import { apply, tw } from "twind";
import { css } from "twind/css";

import "prism/components/prism-jsx?no-check";
import "prism/components/prism-javascript?no-check";
import "prism/components/prism-json?no-check";
import "prism/components/prism-markdown?no-check";
import "prism/components/prism-tsx?no-check";
import "prism/components/prism-typescript?no-check";
import "prism/components/prism-yaml?no-check";

const markdownBody = css({
  // code
  ":not(pre) > code":
    apply`font-mono text-sm py-1 px-1.5 rounded bg-gray(50 dark:900)`,
  pre:
    apply`font-mono text-sm p-2.5 rounded-lg bg-gray(50 dark:900) overflow-x-auto`,

  // general
  a: apply`underline`,
  h1: apply`font-header text-xl md:text-2xl lg:text-3xl pb-2 mb-3`,
  h2: apply`font-header text-lg md:text-xl lg:text-2xl pb-2 mb-3 mt-4`,
  h3:
    apply`font-header font-bold md:(text-lg font-normal) lg:(text-xl font-normal) mb-3 mt-4`,
  h4:
    apply`font-header font-semibold md:(font-bold) lg:(text-lg font-normal) mb-2 mt-3`,
  h5:
    apply`font-header font-italic md:(font-semibold) lg:(font-bold) mb-2 mt-3`,
  h6: apply`font-header md:(font-italic) lg:(font-semibold) mb-1 mt-2`,
  hr: apply`m-2 border-gray(500 dark:400)`,
  ol: apply`list-decimal lg:list-inside`,
  p: apply`my-2`,
  table: apply`table-auto`,
  td: apply`p-2 border border(solid gray(500 dark:400))`,
  th: apply`font-bold text-center`,
  ul: apply`lg:(list-disc list-inside)`,

  // links
  ".anchor": apply`float-left -ml-6 pr-1 leading-4`,
  "svg.octicon": apply`fill-current`,
  "h1 .octicon-link": apply`invisible mt-2`,
  "h1:hover .octicon-link": apply`visible`,
  "h2 .octicon-link": apply`invisible mt-2`,
  "h2:hover .octicon-link": apply`visible`,
  "h3 .octicon-link": apply`invisible mt-2`,
  "h3:hover .octicon-link": apply`visible`,
  "h5 .octicon-link": apply`invisible mt-2`,
  "h5:hover .octicon-link": apply`visible`,
  "h6 .octicon-link": apply`invisible mt-2`,
  "h6:hover .octicon-link": apply`visible`,

  // syntax highlighting
  ".highlight .token": apply`text-cyan(600 dark:400)`,
  ".highlight .token.class-name": apply`text-cyan(600 dark:400)`,
  ".highlight .token.comment": apply`text-gray(600 dark:400)`,
  ".highlight .token.keyword": apply`text-magenta-500`,
  ".highlight .token.number": apply`text-purple(400 dark:300)`,
  ".highlight .token.operator": apply`text-magenta-500`,
  ".highlight .token.punctuation": apply`text(black dark:white)`,
  ".highlight .token.string": apply`text-orange-500 dark:text-yellow-400)`,
});

export function Markdown(
  { children: markdown, baseUrl }: { children: string; baseUrl?: string },
) {
  const __html = render(markdown, { allowIframes: false, baseUrl });
  return (
    <div class={tw`${markdownBody}`} dangerouslySetInnerHTML={{ __html }}>
    </div>
  );
}
