import React, { useMemo, useState } from "react";
import ReactQuill from 'react-quill';

interface HtmlEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({
  onChange = () => {},
  value = "",
}) => {

  return (
    <ReactQuill onChange={onChange} value={value} theme="snow" style={{height: 300}} />
  );
};
export default HtmlEditor;
