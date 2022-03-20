/** @jsx h */

import { h, tw } from "../deps.ts";
import { Logo } from "./logo.tsx";

export function Header() {
  return (
    <header class={tw`p-2 font-heading text(4xl white) bg-blue-500`}>
      <div class={tw`max-w-screen-lg mx-auto`}>
        <Logo />
        <span class={tw`sm:hidden`}>TS Error Index</span>
        <span class={tw`hidden sm:inline`}>TypeScript Error Index</span>
      </div>
    </header>
  );
}

export function Main() {
  return (
    <div>
      <Header />
      <main class={tw`max-w-screen-lg mx-auto`}>
        <h1>Hello from tswhy</h1>
      </main>
    </div>
  );
}
