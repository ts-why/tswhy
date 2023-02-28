import { createPR } from "./github.ts";

Deno.test({
  name: "createPR",
  async fn() {
    const pr = await createPR({
      title: "example",
      body: "something\n\nsomething\n\nsomething\n",
      head: "p-1006",
      author: {
        name: "Kitson Kelly",
        email: "me@kitsonkelly.com",
      },
      files: {
        "docs/1009.md": '---\ntitle: "things"\n---\n\nstuff\n',
      },
    });
    console.log(pr);
  },
});
