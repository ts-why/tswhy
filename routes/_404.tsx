import { Head } from "$fresh/runtime.ts";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Not Found | tswhy‽</title>
      </Head>
      <main class="p-4 mx-auto max-w-screen-lg flex flex-col items-center">
        <div class="text-9xl font-header bg-blue-500 px-10 py-2 rounded-lg text-yellow-500">
          ‽
        </div>
        <div class="text-4xl font-header my-4">Not Found</div>
        <div>Sadly, the page you are looking for does not exist.</div>
      </main>
    </>
  );
}
