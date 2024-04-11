import { assert } from "@std/assert/assert";

import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import Search from "../islands/Search.tsx";

export default function Home() {
  const appId = Deno.env.get("ALGOLIA_APP_ID");
  assert(appId);
  const apiKey = Deno.env.get("ALGOLIA_ADMIN_KEY");
  assert(apiKey);

  return (
    <>
      <div class="p-4 mx-auto max-w-screen-xl">
        <Header canonical="/" />
        <main>
          <div class="m-4 space-y-2">
            <p>
              <span class="font-header">tswhy‽</span>{" "}
              is a community effort to enrich TypeScript diagnostics, providing
              documentation of what can cause the diagnostic to occur and common
              fixes or workarounds.
            </p>
          </div>
          <Search appId={appId} apiKey={apiKey} />
        </main>
      </div>
      <Footer />
    </>
  );
}
