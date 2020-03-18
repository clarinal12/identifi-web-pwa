import React, { useState, useEffect } from 'react';
import BraftEditor, { EditorState } from 'braft-editor';
import styled from 'styled-components';
import 'braft-editor/dist/index.css';

const StyledBraftEditor = styled(BraftEditor)`
  .bf-controlbar  {
    box-shadow: none;
  }
  .bf-content {
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    min-height: 165px;
    height: auto;
  }
`;

interface IAppTextEditor {
  value: string,
  onChange: (content: string) => void,
}

const AppTextEditor: React.FC<IAppTextEditor> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState<EditorState | null>(BraftEditor.createEditorState(value));

  useEffect(() => {
    if (!value) {
      setEditorState(BraftEditor.createEditorState(value))
    }
  }, [value]);

  return (
    <StyledBraftEditor
      language="en"
      value={editorState}
      onChange={editorState => {
        setEditorState(editorState);
        if (!value && editorState.toHTML() !== '<p></p>') {
          onChange(editorState.toHTML());
        }
        if (value && editorState.toHTML() === '<p></p>') {
          onChange('');
        }
      }}
      controls={['bold', 'italic', 'underline', 'strike-through', 'list-ol']}
      placeholder="Write something here..."
      fixPlaceholder={true}
    />
  );
}

export default AppTextEditor;
