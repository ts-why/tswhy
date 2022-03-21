/** @jsx h */

import { h, tw } from "../deps.ts";
import { Logo } from "./logo.tsx";
import { CodeItem } from "./code.tsx";

export function Header() {
  return (
    <header
      class={tw`px-2 py-4 font-heading text(4xl white) bg-blue-500`}
    >
      <div class={tw`max-w-screen-lg mx-auto`}>
        <Logo />
        <span class={tw`mx-4 sm:hidden`}>
          TS Error Index
        </span>
        <span class={tw`mx-4 hidden sm:inline`}>
          TypeScript Error Index
        </span>
      </div>
    </header>
  );
}

export function Toggle() {
  return (
    <svg
      width="32"
      height="20"
      viewBox="0 0 32 20"
      fill="none"
      class={tw`inline-block`}
    >
      <path d="M2 2L16 16L30 2" stroke="currentColor" stroke-width="5" />
    </svg>
  );
}

export function Info() {
  return (
    <aside
      class={tw`text-white bg-brown-500 p-6 my-6 border(0 b-8 solid brown-300)`}
    >
      <h2 class={tw`text-2xl font-heading`}>
        <Toggle />
        <span class={tw`mx-3`}>What is the TypeScript error index?</span>
      </h2>
      <div class={tw`mt-4`}>
        <p>
          When the TypeScript compiler gives a message, each message has a
          unique number attached to it. This number is book-keeping for
          TypeScript, but it does make it easy to search the internet for your
          error codes. This site covers each...
        </p>
      </div>
    </aside>
  );
}

export function Main() {
  return (
    <div>
      <Header />
      <main class={tw`max-w-screen-lg mx-auto p-4`}>
        <Info />
        <CodeItem />
      </main>
    </div>
  );
}
