import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import Search from "../islands/Search.tsx";

export default function Home() {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-lg">
        <Header />
        <main>
          <div class="m-4 space-y-2">
            <p>
              <span class="font-header">tswhy?</span>{" "}
              is a community effort to enrich TypeScript diagnostics, providing
              documentation of what can cause the diagnostic to occur and common
              fixes or workarounds.
            </p>
          </div>
          <Search />
        </main>
      </div>
      <Footer />
    </>
  );
}
