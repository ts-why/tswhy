import { asset } from "$fresh/runtime.ts";

export default function IconEdit() {
  return (
    <svg
      class="w-6 h-6"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <use
        href={`${asset("/sprites.svg")}#edit`}
      />
    </svg>
  );
}
