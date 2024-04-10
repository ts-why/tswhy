import { render } from "@deno/gfm";

import "prismjs/components/prism-jsx?no-check";
import "prismjs/components/prism-javascript?no-check";
import "prismjs/components/prism-json?no-check";
import "prismjs/components/prism-markdown?no-check";
import "prismjs/components/prism-tsx?no-check";
import "prismjs/components/prism-typescript?no-check";
import "prismjs/components/prism-yaml?no-check";

export default function Markdown(
  { children, baseUrl }: { children: string; baseUrl?: string },
) {
  const __html = render(children, { allowIframes: false, baseUrl });
  return <div class="markdown" dangerouslySetInnerHTML={{ __html }}></div>;
}
