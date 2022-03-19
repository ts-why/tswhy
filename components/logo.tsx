/** @jsx h */

import { h, tw } from "../deps.ts";

export function Logo() {
  return (
    <svg
      width="36"
      height="36"
      stroke="currentColor"
      viewBox="0 0 36 36"
      fill="none"
      class={tw`inline-block`}
    >
      <title>TSWhy Logo</title>
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="8"
        stroke-width="4"
      />
      <path
        d="M19 19L33.5 33.5"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  );
}
