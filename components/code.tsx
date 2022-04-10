/** @jsx h */

import { content, h, tw } from "../deps.ts";
import { type Child, take } from "../common.ts";
import { type DiagnosticMessageCategory } from "../diagnostics/interfaces.d.ts";
import { Markdown } from "./markdown.tsx";

export const Code = ({
  children,
  item,
}: {
  children: Child<string | undefined>;
  item: {
    message: string;
    category: DiagnosticMessageCategory;
  };
}) => {
  const markdown = take(children);
  return (
    <div>
      <h1>{item.message}</h1>
      <h2>{item.category}</h2>
      <Markdown>{markdown}</Markdown>
    </div>
  );
};

export function CodeItem() {
  return (
    <div class={tw`my-6`}>
      <h1 class={tw`text-3xl px-6 mb-2 font-heading`}>TS1002</h1>
      <div class={tw`bg-gray-600 p-6 my-2`}>
        <h2 class={tw`text-3xl font-heading mb-2`}>
          Unterminated string literal
        </h2>
        <div class={tw`space-y-4 my-4`}>
          <p>
            Occurs when there is an unterminated string literal somewhere.
            String literals must be enclosed by single (<code>'</code>) or
            double (<code>
              "
            </code>) quotes.
          </p>
          <p>
            Often, it caused by an attempt to use a string literal over multiple
            lines:
          </p>
          <pre class={tw`bg-white p-4`}>
            <code>
              {`const str = "Here is some text
  that I want to break
  across multiple lines.";
`}
            </code>
          </pre>
        </div>
        <h3 class={tw`text-2xl font-heading my-4`}>Fix: Multiple Lines</h3>
        <div class={tw`space-y-4 my-2`}>
          <p>
            If you are trying to break a string across multiple lines, you can
            use
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals"
              target="_blank"
            >
              {" "}template literals{" "}
            </a>
            using the backtick (<code>`</code>) instead:
          </p>
          <pre class={tw`bg-white p-4`}>
            <code>
              {`const str = \`Here is some text
  that I want to break
  across multiple lines.\`;`}
            </code>
          </pre>
          <p>Or you can use string concatenation:</p>
          <pre class={tw`bg-white p-4`}>
            <code>
              {`const str = "Here is some text" +
  "that I want to break" +
  "across multiple lines.";`}
            </code>
          </pre>
          <p>
            Or you can use a backslash (<code>\</code>) at the end of the line:
          </p>
          <pre class={tw`bg-white p-4`}>
            <code>
              {`const str = "Here is some text \\
  that I want to break \\
  across multiple lines.";`}
            </code>
          </pre>
        </div>
      </div>
      <div
        class={tw`bg-gray-600 flex space-x-4 p-6`}
      >
        <div>
          <h3 class={tw`font-medium`}>Tags</h3>
          <ul class={tw`flex`}>
            <li>syntax-error</li>
            <li class={tw`before::${content('", "')}`}>incomplete-code</li>
            <li class={tw`before::${content('", "')}`}>strings</li>
          </ul>
        </div>
        <div>
          <h3 class={tw`font-medium`}>Related</h3>
          <ul>
            <li>
              TS1003 <span>Identifier Expected</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
