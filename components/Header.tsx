import { Head } from "$fresh/runtime.ts";

export function Header(
  {
    title = "tswhy?",
    description = "A community effort to enrich TypeScript diagnostics.",
    keywords = ["typescript", "diagnostics"],
  }: { title?: string; description?: string; keywords?: string[] },
) {
  return (
    <header class="flex items-center">
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@typescript_why" />

        <title>{title}</title>
        <meta name="twitter:title" content={title} />
        <meta property="og:title" content={title} />

        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="description" content={description} />

        <meta name="twitter:creator" content="@typescript_why" />

        <meta name="twitter:image" content="/tswhy_post.png" />
        <meta property="og:image" content="/tswhy_post.png" />
        <meta
          name="twitter:image:alt"
          content="A community effort to enrich TypeScript diagnostics."
        />
        <meta
          property="og:image:alt"
          content="A community effort to enrich TypeScript diagnostics."
        />

        <meta property="og:site_name" content="tswhy?" />
        <meta property="og:locale" content="en_AU" />

        <meta name="keywords" content={keywords.join(", ")} />
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
