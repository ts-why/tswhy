/** @jsx h */

import {  h } from "../deps.ts";
import { comrak } from "../deps.ts";
import { type Child, take } from "../common.ts";

export function DiagnosticBody (props: { code: string }) {

    const md = `${Deno.cwd()}/diagnostics/${props.code}.md`;
    let code = "";
    if (!Deno.statSync(md)) {
        return null
    } 

    code = Deno.readTextFileSync(md);
    return <Markdown>{code}</Markdown>
}

function Markdown({ children, id }: {
    children: Child<string | undefined>;
    id?: string;
  }) {
    const md = take(children);
    if (!md) throw new Error("no markdown given to the Markdown component");
  
    const html = syntaxHighlight(
      comrak.markdownToHTML(md, {
    
        extension: {
          autolink: true,
          descriptionLists: true,
          strikethrough: true,
          table: true,
          tagfilter: true,
        },
      })
    );
  
    // @ts-ignore - innerHTML is not defined on the types 
    return <div class="" id={id} innerHTML={{__dangerousHtml: html }} />;
  }
  
  const syntaxHighlight = (html: string) => html
  
  const CODE_BLOCK_RE =
    /<pre><code\sclass="language-([^"]+)">([^<]+)<\/code><\/pre>/m;
  
  // Twoslash version of syntax highlighter
  
  // const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
  
  // /** Syntax highlight code blocks in an HTML string. */
  // export function syntaxHighlight(html: string): string {
  //   let match;
  //   while ((match = CODE_BLOCK_RE.exec(html))) {
  //     const [text, lang, code] = match;
  //     // const mebCode = 
  //     // console.log({ text, lang, mebCode})
  //     // const tree = lowlight.highlight(lang, htmlEntities.decode(code), {
  //     //   prefix: "code-",
  //     // });
  //     // assert(match.index != null);
  //     const plainCode = htmlEntities.decode(code)
  //     const twoslash = runTwoSlash(code, "ts", { })
  //     const renderedCode = renderCodeToHTML(plainCode, lang,  { twoslash: true }, { }, highlighter, twoslash)
  //     html = `${html.slice(0, match.index)}<pre><code>${
  //       // toHtml(tree)
  //       renderedCode
  //     }</code></pre>${html.slice(match.index + text.length)}`;
  //   }
  //   return html;
  // }
  