import { type Handlers, type PageProps } from "$fresh/server.ts";
import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import { Markdown } from "../components/Markdown.tsx";

type Data = string;

export default function Contributing({ data }: PageProps<Data>) {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-lg">
        <Header title={`tswhy? - Contributing`} />
        <article class="rounded-lg bg-gray(100 dark:800) my-4 p-8">
          <Markdown>{data}</Markdown>
        </article>
      </div>
      <Footer />
    </>
  );
}

let data: Data;

export const handler: Handlers<Data> = {
  async GET(_req, { render, renderNotFound }) {
    if (data) {
      return render(data);
    }
    try {
      const res = await fetch(
        new URL("../content/contributing.md", import.meta.url),
      );
      if (res.status === 200) {
        data = await res.text();
        return render(data);
      }
    } catch {
      //
    }
    return renderNotFound();
  },
};
