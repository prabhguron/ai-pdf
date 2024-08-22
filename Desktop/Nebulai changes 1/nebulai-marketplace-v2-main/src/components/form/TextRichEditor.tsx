"use client"
import { ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { convertToRaw, ContentState, EditorState } from "draft-js";
import { Editor, SyntheticEvent } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

interface TextRichEditorProps {
  name: string;
  value: string;
  setFieldValue: (value: string) => void;
  setFormattedField: (value: string) => void;
}

const TextRichEditor = ({
  name,
  value,
  setFieldValue,
  setFormattedField,
}: TextRichEditorProps) => {
  const [wordCount, setWordCount] = useState(0);
  const [onFocus, setOnFocus] = useState<any>(null);

  const prepareDraft = (value: string) => {
    const draft = htmlToDraft(value);
    const contentState = ContentState.createFromBlockArray(draft.contentBlocks);

    const editorState = EditorState.createWithContent(contentState);

    return editorState;
  };

  const [editorState, setEditorState] = useState(
    value ? prepareDraft(value) : EditorState.createEmpty()
  );

  useEffect(() => {
    if (value && !onFocus) {
      setEditorState(prepareDraft(value));
    }
  }, [value]);

  const onEditorStateChange = (editorState: EditorState) => {
    const editorRawContent = convertToRaw(editorState.getCurrentContent());
    const formattedHtmlText = draftToHtml(editorRawContent);

    const blocks = editorRawContent.blocks;
    const rawText = blocks
      .map((block) => (!block.text.trim() && "\n") || block.text)
      .join("\n");

    setFieldValue(rawText);
    setFormattedField(formattedHtmlText);
    setEditorState(editorState);
    calculateWordCount();
  };

  const calculateWordCount = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText("");
    const wordCount = plainText.trim().split(/\s+/).length;
    setWordCount(wordCount);
  };

  const onBlurHandler = (e: SyntheticEvent) => {
    setOnFocus(null);
  };

  return (
    <>
      <p className="mb-2">
        Word Count: <span className="fw-bold">{wordCount}</span>
      </p>
      <ErrorMessage
        component="div"
        name={name}
        className="error text-danger"
        render={(errorMessages: string | string[]) => {
          let errMsgs = errorMessages;
          if (typeof errorMessages === "object") {
            errMsgs = errorMessages.map((e: any) => e.value).join(", ");
          }
          return <div className="error text-danger">{errMsgs}</div>;
        }}
      />
      <Editor
        toolbarClassName="editor-toolbar"
        wrapperClassName="editor-wrapper"
        editorClassName="editor-box"
        toolbar={{
          options: ["inline", "fontSize", "list", "emoji"],
          inline: { options: ["bold", "italic", "underline"] },
          fontSize: { options: [10, 11, 12, 14, 16, 18, 24, 32] },
        }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        spellCheck
        onBlur={onBlurHandler}
        onFocus={setOnFocus}
      />
    </>
  );
};

export default TextRichEditor;
