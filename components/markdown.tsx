import { render } from "gfm";
import { apply, tw } from "twind";
import { css } from "twind/css";

import "prism/components/prism-jsx?no-check";
import "prism/components/prism-javascript?no-check";
import "prism/components/prism-tsx?no-check";
import "prism/components/prism-typescript?no-check";

const markdownBody = css({
  // code
  ":not(pre) > code":
    apply`font-mono text-sm py-1 px-1.5 rounded bg-gray(50 dark:900)`,
  pre:
    apply`font-mono text-sm p-2.5 rounded-lg bg-gray(50 dark:900) overflow-x-auto`,

  // general
  a: apply`underline`,
  h1: apply`text-xl md:text-2xl lg:text-3xl`,
  h2: apply`text-lg md:text-xl lg:text-2xl`,
  h3: apply`font-bold md:(text-lg font-normal) lg:(text-xl font-normal)`,
  h4: apply`font-semibold md:(font-bold) lg:(text-lg font-normal)`,
  h5: apply`font-italic md:(font-semibold) lg:(font-bold)`,
  h6: apply`md:(font-italic) lg:(font-semibold)`,
  hr: apply`m-2 border-gray(500 dark:400)`,
  ol: apply`list-decimal lg:list-inside`,
  p: apply`my-2`,
  table: apply`table-auto`,
  td: apply`p-2 border border(solid gray(500 dark:400))`,
  th: apply`font-bold text-center`,
  ul: apply`lg:(list-disc list-inside)`,

  // syntax highlighting
  ".highlight .token": apply`text-cyan(600 dark:400)`,
  ".highlight .token.class-name": apply`text-cyan(600 dark:400)`,
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
