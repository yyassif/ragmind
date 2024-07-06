import { EditorContent } from "@tiptap/react";
import { useEffect } from "react";

import { useChatStateUpdater } from "./hooks/useChatStateUpdater";
import { useCreateEditorState } from "./hooks/useCreateEditorState";
import { useEditor } from "./hooks/useEditor";

import "./styles.css";

type EditorProps = {
  onSubmit: () => void;
  setMessage: (text: string) => void;
  message: string;
  placeholder?: string;
};

export const Editor = ({
  setMessage,
  onSubmit,
  placeholder,
  message,
}: EditorProps): JSX.Element => {
  const { editor } = useCreateEditorState(placeholder);
  const { submitOnEnter } = useEditor({
    onSubmit,
  });

  useEffect(() => {
    const htmlString = editor?.getHTML();
    if (
      message === "" ||
      (htmlString &&
        new DOMParser().parseFromString(htmlString, "text/html").body
          .textContent === " ")
    ) {
      editor?.commands.clearContent();
    }
  }, [message, editor]);

  useChatStateUpdater({
    editor,
    setMessage,
  });

  return (
    <EditorContent
      className="w-full caret-slate-700 dark:caret-slate-200 !focus-visible:outline-none"
      onKeyDown={(event) => void submitOnEnter(event)}
      editor={editor}
    />
  );
};
