import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import Markdown from "../components/Markdown.tsx";

let data: string;

export default async function Contributing() {
  if (!data) {
    const res = await fetch(
      new URL("../content/contributing.md", import.meta.url),
    );
    if (res.ok) {
      data = await res.text();
    } else {
      return null;
    }
  }
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-xl">
        <Header
          title="tswhy? - Contributing"
          canonical="/contributing"
          description="Information on integrating to tswhy‽"
        />
        <article class="rounded-lg bg-gray-100 dark:bg-gray-800 my-4 p-8">
          <Markdown>{data}</Markdown>
        </article>
      </div>
      <Footer />
    </>
  );
}
