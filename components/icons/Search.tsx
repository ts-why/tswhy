import { asset } from "$fresh/runtime.ts";

export default function IconSearch() {
  return (
    <svg
      class="w-5 h-5"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <use
        href={`${asset("/sprites.svg")}#search`}
      />
    </svg>
  );
}
