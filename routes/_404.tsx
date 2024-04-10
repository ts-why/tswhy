import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>Not Found | tswhy‽</title>
      </Head>
      <main class="mt-8 p-4 mx-auto max-w-screen-xl flex flex-col items-center">
        <img src="/tswhy.svg" class="w-32 h-32" alt="the tswhy logo" />
        <div class="text-4xl font-header my-4">Not Found</div>
        <div>Sadly, the page you are looking for does not exist.</div>
      </main>
    </>
  );
}
