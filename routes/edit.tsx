import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import Editor from "../islands/Editor.tsx";

export default function Edit() {
  return (
    <>
      <div class="p-4 mx-auto max-w-screen-lg">
        <Header />
        <main>
          <Editor />
        </main>
      </div>
      <Footer />
    </>
  );
}
