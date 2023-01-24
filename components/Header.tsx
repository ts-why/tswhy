import { Head } from "$fresh/runtime.ts";

export function Header({ title = "tswhy?" }: { title?: string }) {
  return (
    <header class="flex items-center">
      <Head>
        <title>{title}</title>
      </Head>
      <a href="/">
        <img
          src="/tswhy.svg"
          class="w-16 h-16 flex-initial"
          alt="the tswhy logo: a question mark in a box"
        />
      </a>
      <div class="flex-grow p-4">
        <h1 class="text-3xl font-header">tswhy?</h1>
        <h2 class="text-sm">
          A community effort to enrich TypeScript diagnostics.
        </h2>
      </div>
    </header>
  );
}
