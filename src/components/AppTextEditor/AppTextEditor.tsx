import React, { useState } from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { Icon, Tooltip, Typography } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Text } = Typography;

const StyledEditorWrapper = styled.div`
  .identifi-toolbar {
    border: none;
    padding: 6px !important;
    margin-bottom: 0;
    .toolbar-button {
      width: 36px;
      height: 36px;
      color: #6a6f7b;
      border-radius: 4px;
      &:hover {
        cursor: pointer;
        background: #e8e8e880;
      }
    }
  }
  .identifi-editor {
    font-size: 16px;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    padding: 12px;
    min-height: 165px;
    line-height: 1.5;
    height: auto;
    .public-DraftStyleDefault-block {
      margin: 0;
    }
  }
`;

const TOOLBAR_ALIAS: { [key: string]: string | undefined } = {
  'unordered': 'unordered-list',
  'ordered': 'ordered-list',
};

const ToolbarComponent: React.FC<any> = (props) => {
  const { config, onChange, currentState } = props;
  return config.options.map((option: string, idx: number) => (
    <Tooltip
      key={`${option}-${idx}`}
      placement="bottom"
      title={(
        <Text className="text-capitalize text-white">
          {TOOLBAR_ALIAS[option]?.split('-').join(' ') || option}
        </Text>
      )}
    >
      <div
        className={cx({
          'toolbar-button d-flex align-items-center justify-content-center': true,
          'text-primary': currentState[option] || currentState.listType === option,
        })}
        onClick={() => onChange(option, !currentState[option])}
        style={{ marginRight: 2 }}
      >
        <Icon type={TOOLBAR_ALIAS[option] || option} />
      </div>
    </Tooltip>
  ))
}

interface IAppTextEditor {
  value: string,
  disabled?: boolean,
  onChange: (content: string) => void,
  placeholder?: string,
}

const AppTextEditor: React.FC<IAppTextEditor> = ({
  value, disabled, onChange, placeholder = "Write something here...",
}) => {
  const initialValue = htmlToDraft(value);
  const contentState = ContentState.createFromBlockArray(initialValue.contentBlocks);
  const editorInitialState = EditorState.createWithContent(contentState);

  const [editorState, setEditorState] = useState(editorInitialState);

  return (
    <StyledEditorWrapper>
      <Editor
        readOnly={disabled}
        placeholder={placeholder}
        wrapperClassName="identifi-editor-wrapper"
        editorClassName="identifi-editor"
        toolbarClassName="identifi-toolbar"
        editorState={editorState}
        onEditorStateChange={newEditorState => {
          const htmlString = draftToHtml(convertToRaw(editorState.getCurrentContent()));
          setEditorState(newEditorState);
          onChange(htmlString);
        }}
        toolbar={{
          options: ['inline', 'list'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
            component: ToolbarComponent,
          },
          list: {
            options: ['unordered', 'ordered'],
            component: ToolbarComponent,
          }
        }}
      />
    </StyledEditorWrapper>
  );
}

export default AppTextEditor;
