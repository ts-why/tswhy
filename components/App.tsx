/** @jsx h */

import { h, Helmet, tw } from "../deps.ts";
import { app } from "../styles.ts";

export function App({ children }: { children?: unknown }) {
  return (
    <div class={tw`h-screen bg-white dark:(bg-gray-900 text-white) ${app}`}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="theme-color"
          media={`(prefers-color-scheme: white)`}
          content="white"
        />
        <meta
          name="theme-color"
          media={`(prefers-color-scheme: #111827})`}
          content="black"
        />
      </Helmet>
      {children}
    </div>
  );
}
