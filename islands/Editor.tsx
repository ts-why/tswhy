import { Head, IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect } from "preact/hooks";
import {
  batch,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import {
  diagnosticDataFixesToMarkdown,
  diagnosticDataToMarkdown,
} from "$utils/diagnostics.ts";
import type { DiagnosticData } from "$utils/types.ts";
import { useSignalRef } from "$utils/use-signal-ref.ts";

import Preview from "../components/Preview.tsx";
import Propose from "../components/Propose.tsx";
import Tabs from "../components/Tabs.tsx";

// It is difficult getting stuff to load server side, so we will just
// dynamically import only when running in the browser.
const monaco = IS_BROWSER ? (await import("monaco-editor")) : undefined;
const editorWorker = IS_BROWSER
  ? (await import("monaco-editor/editorWorker")).default
  : undefined;

self.MonacoEnvironment = {
  getWorker(_, _label) {
    // @ts-ignore the types really don't work here, but the code does
    return new editorWorker();
  },
};

export default function Editor(
  { diagnosticData }: { diagnosticData: DiagnosticData },
) {
  const { code } = diagnosticData;
  const editor = useSignal<
    import("monaco-editor").editor.IStandaloneCodeEditor | null
  >(null);
  const monacoRef = useSignalRef<HTMLDivElement>(null);
  const tab = useSignal(0);
  const doc = useSignal(diagnosticDataToMarkdown(diagnosticData));
  const docModel = useSignal<import("monaco-editor").editor.ITextModel | null>(
    null,
  );
  const fixes = useSignal(diagnosticDataFixesToMarkdown(diagnosticData));
  const fixModels = useSignal<import("monaco-editor").editor.ITextModel[]>([]);
  const darkMode = useSignal(false);
  const dirty = useSignal(false);
  const fixCount = useComputed(() => fixes.value.length);

  useEffect(() => {
    if (IS_BROWSER && "matchMedia" in window) {
      // deno-lint-ignore no-window
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        darkMode.value = true;
      }
      // deno-lint-ignore no-window
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
        "change",
        (evt) => {
          if (evt.matches) {
            darkMode.value = true;
          } else {
            darkMode.value = false;
          }
        },
      );
    }
  });

  useSignalEffect(() => {
    if (monaco && monacoRef.value && !editor.value) {
      const model = monaco.editor.createModel(doc.peek(), "markdown");
      model.onDidChangeContent(() =>
        batch(() => {
          dirty.value = true;
          doc.value = model.getValue(monaco.editor.EndOfLinePreference.LF);
        })
      );
      const ed = monaco.editor.create(monacoRef.current!, {
        model,
        minimap: { enabled: false },
        theme: darkMode.peek() ? "vs-dark" : "vs",
      });

      batch(() => {
        editor.value = ed;
        docModel.value = model;
        fixModels.value = fixes.peek().map((fix) => {
          const model = monaco.editor.createModel(fix, "markdown");
          model.onDidChangeContent(() =>
            batch(() => {
              dirty.value = true;
              fixes.value = fixModels.peek().map((model) =>
                model.getValue(monaco.editor.EndOfLinePreference.LF)
              );
            })
          );
          return model;
        });
      });
    }
  });

  useSignalEffect(() => {
    if (monaco && editor.value) {
      if (tab.value) {
        if (tab.value <= fixCount.value) {
          editor.value.setModel(fixModels.value[tab.value - 1]);
        } else {
          const model = monaco.editor.createModel(
            `---\ntitle: ""\n---\n\n`,
            "markdown",
          );
          model.onDidChangeContent(() =>
            fixes.value = fixModels.value!.map((model) => model.getValue())
          );
          batch(() => {
            dirty.value = true;
            fixModels.value = [...fixModels.value, model];
            fixes.value = fixModels.value!.map((model) => model.getValue());
          });
        }
      } else {
        editor.value.setModel(docModel.value);
      }
    }
  });

  useSignalEffect(() => {
    if (monaco) {
      if (darkMode.value) {
        monaco.editor.setTheme("vs-dark");
      } else {
        monaco.editor.setTheme("vs");
      }
    }
  });

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/editor.main.css" />
      </Head>
      <h2 class="text-2xl font-header py-4">
        Editing TS{code}:
      </h2>
      <div class="m-2 space-y-2 border border-gray-500 rounded p-4">
        <p>
          All diagnostics and fixes are authored in markdown. Propose any
          changes by editing the markdown. Additional fixes can be added. A
          preview of the rendered diagnostic will update when changes are made.
        </p>
        <p>
          Once all proposed changes are made, the{" "}
          <span class="font-bold italic">Propose</span>{" "}
          button will submit the information and confirm raising the PR.
        </p>
      </div>
      <div class="flex">
        <div class="px-4 flex-grow">
          <div class="my-4">
            <Tabs selected={tab} fixCount={fixCount} />
            <div class="w-full h-96" ref={monacoRef}></div>
          </div>
          <Propose
            code={code}
            doc={doc}
            fixes={fixes}
            dirty={dirty}
          />
        </div>
        <Preview code={code} doc={doc} fixes={fixes} />
      </div>
    </>
  );
}
