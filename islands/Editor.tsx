import { Head, IS_BROWSER } from "$fresh/runtime.ts";
import { useContext } from "preact/hooks";
import { batch, effect } from "@preact/signals";
import editorWorker from "monaco-editor/editor";
import type { DiagnosticData } from "$types";
import {
  diagnosticDataFixesToMarkdown,
  diagnosticDataToMarkdown,
} from "$util/diagnostics.ts";
import { useSignalRef } from "$util/useSignalRef.ts";

import { DiagnosticPreview } from "../components/DiagnosticPreview.tsx";
import { PartMenu } from "../components/PartMenu.tsx";
import { Submit } from "../components/Submit.tsx";
import { EditorState } from "../state/EditorState.ts";

// needs to be imported asynchronously, because importing when it is server-side
// causes exceptions as the library tries to bootstrap itself.
const monaco = IS_BROWSER ? (await import("monaco-editor")) : null;

self.MonacoEnvironment = {
  getWorker(_, _label) {
    return editorWorker(true);
  },
};

export default function Editor({ children }: { children: DiagnosticData }) {
  const {
    editor,
    currentTab,
    md,
    darkMode,
    dirty,
    docModel,
    fixes,
    fixModels,
    fixCount,
  } = useContext(EditorState);

  md.value = diagnosticDataToMarkdown(children);
  fixes.value = diagnosticDataFixesToMarkdown(children);

  // Handle changes to the current tab.
  effect(() => {
    if (editor.value) {
      if (currentTab.value && fixModels.value) {
        if (currentTab.value <= fixCount.value) {
          editor.value.setModel(fixModels.value[currentTab.value - 1]);
        } else {
          const fixModel = monaco!.editor.createModel(
            `---\ntitle: ""\n---\n\n`,
            "markdown",
          );
          fixModel.onDidChangeContent(() =>
            fixes.value = fixModels.value!.map((model) => model.getValue())
          );
          batch(() => {
            dirty.value = true;
            fixModels.value = [...fixModels.value!, fixModel];
            fixes.value = fixModels.value.map((model) => model.getValue());
          });
        }
      } else {
        editor.value.setModel(docModel.value);
      }
    }
  });

  /** The ref to the monaco root element, used to init the editor. */
  const monacoSignalRef = useSignalRef(null);

  // When the ref to the DOM element for the editor is set, initialise the
  // editor.
  const dispose = effect(() => {
    if (monaco && monacoSignalRef.value && !editor.value) {
      // this is a fire once effect
      dispose();

      const model = monaco.editor.createModel(md.value, "markdown");

      const ed = monaco.editor.create(monacoSignalRef.current!, {
        model,
        minimap: { enabled: false },
        theme: darkMode.peek() ? "vs-dark" : "vs",
      });

      effect(() => {
        if (darkMode.value) {
          monaco.editor.setTheme("vs-dark");
        } else {
          monaco.editor.setTheme("vs");
        }
      });

      model.onDidChangeContent(() =>
        batch(() => {
          dirty.value = true;
          md.value = model.getValue(monaco.editor.EndOfLinePreference.LF);
        })
      );

      batch(() => {
        editor.value = ed;
        docModel.value = model;
        fixModels.value = diagnosticDataFixesToMarkdown(children).map(
          (value) => {
            const model = monaco.editor.createModel(value, "markdown");
            model.onDidChangeContent(() =>
              batch(() => {
                dirty.value = true;
                fixes.value = fixModels.value!.map((model) => model.getValue());
              })
            );
            return model;
          },
        );
        fixes.value = fixModels.value.map((model) => model.getValue());
      });
    }
  });

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://esm.sh/monaco-editor@0.34.1?css" />
      </Head>
      <h2 class="text-2xl font-header py-4">Editing TS{children.code}:</h2>
      <div class="my-4">
        <PartMenu />
        <div class="w-full h-96" ref={monacoSignalRef}></div>
      </div>
      <Submit code={children.code} />
      <h2 class="text-2xl font-header py-4">Preview:</h2>
      <DiagnosticPreview code={children.code} fixes={fixes}>
        {md}
      </DiagnosticPreview>
    </>
  );
}
