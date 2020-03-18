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
  disabled?: boolean,
  onChange: (content: string) => void,
}

const AppTextEditor: React.FC<IAppTextEditor> = ({ value, onChange, disabled }) => {
  const [editorState, setEditorState] = useState<EditorState | null>(BraftEditor.createEditorState(value));

  useEffect(() => {
    if (!value && !editorState.isEmpty()) {
      setEditorState(BraftEditor.createEditorState(value));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <StyledBraftEditor
      readOnly={disabled}
      language="en"
      value={editorState}
      onChange={editorState => {
        setEditorState(editorState);
        if (!editorState.isEmpty()) {
          onChange(editorState.toHTML());
        } else if (editorState.isEmpty() && value) {
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
