import { Head, IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import type { editor } from "monaco-editor";
import editorWorker from "monaco-editor/editor";

self.MonacoEnvironment = {
  getWorker(_, _label) {
    return editorWorker(true);
  },
};

const monaco = IS_BROWSER ? (await import("monaco-editor")) : null;

export default function Editor() {
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null,
  );
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monaco && monacoEl && !editor) {
      console.log();
      setEditor(monaco.editor.create(monacoEl.current!, {
        value: ["# Heading 1", "", "Some _content_...", ""].join("\n"),
        language: "markdown",
      }));
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://esm.sh/monaco-editor@0.34.1?css"
        />
      </Head>
      <div class="w-1/2 h-96 my-8" ref={monacoEl}></div>
    </>
  );
}
