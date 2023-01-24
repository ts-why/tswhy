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
              tswhy? is a community effort to enrich TypeScript diagnostics,
              providing documentation of what can cause the diagnostic to occur
              and common fixes or workarounds.
            </p>
            <p>
              Use the search below to find the diagnostic you are looking for.
            </p>
            <p>
              Check out{" "}
              <a href="/contributing">
                <code>/contributing</code>
              </a>{" "}
              for information on how to contribute to the project.
            </p>
          </div>
          <Search />
        </main>
      </div>
    </>
  );
}
