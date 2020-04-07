import React, { useState, useImperativeHandle, forwardRef, useEffect, Ref, useRef } from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { Icon, Tooltip, Typography, Popover } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Text } = Typography;

export interface IRefObject {
  resetEditor: (content: string) => void
}

interface IAppTextEditor {
  value: string,
  ref?: Ref<IRefObject>,
  disabled?: boolean,
  onChange: (content: string) => void,
  placeholder?: string,
}

const StyledPopoverContentWrapper = styled.div`
  max-width: 228px;
  max-height: 214px;
  overflow: hidden;
  &:hover {
    overflow: auto;
    &::-webkit-scrollbar-thumb {
      display: block;
    }
    .ant-list-item {
      width: calc(100% - 1px);
    }
  }

  /* total width */
  &::-webkit-scrollbar {
    width: 6px !important;
  }

  /* scrollbar itself */
  &::-webkit-scrollbar-thumb {
    background-color: #babac0 !important;
    border-radius: 12px !important;
    border: none !important;
  }

  /* set button(top and bottom of the scrollbar) */
  &::-webkit-scrollbar-button {
    display: none !important;
  }
  ul {
    list-style-type: none;
    padding-inline-start: 0;
    li {
      width: 36px;
      height: 36px;
      padding: 6px;
      border-radius: 4px;
      &:hover {
        cursor: pointer;
        background: #e8e8e880;
      }
    }
  }
`;

const StyledEditorWrapper = styled.div`
  &.hide-placeholder {
    .public-DraftEditorPlaceholder-root {
      display: none;
    }
  }
  .identifi-editor-wrapper {
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    .identifi-toolbar {
      background: #e8e8e840;
      border-radius: 4px 4px 0 0;
      border: none;
      padding: 6px !important;
      margin-bottom: 0;
      .toolbar-button {
        width: 32px;
        height: 32px;
        color: #6a6f7b;
        border-radius: 4px;
        .anticon {
          font-size: 12px;
        }
        &.emoji {
          position: absolute;
          right: 6px;
        }
        &:hover {
          cursor: pointer;
          background: #e8e8e880;
        }
      }
    }
    .identifi-editor {
      padding: 12px;
      line-height: 1.5;
      min-height: 165px;
      height: auto;
      p, span, ul, ol {
        font-size: 16px !important;
      }
      ol, ul {
        margin: 0;
        padding-inline-start: 30px;
        li {
          margin: 0;
        }
      }
      .public-DraftStyleDefault-block {
        margin: 0;
      }
    }
  }
`;

const StyledHTMLRenderer = styled.div`
  word-break: break-word;
  p, span, ul, ol {
    font-size: 16px !important;
  }
  p {
    min-height: 20.8px;
    margin: 0;
  }
  strong {
    font-weight: 500;
  }
  ul {
    li {
      list-style-type: disc !important;
    }
  }
  ul, ol {
    margin: 0;
    padding-inline-start: 30px;
  }
`;

const TOOLBAR_ALIAS: { [key: string]: string | undefined } = {
  'unordered': 'unordered-list',
  'ordered': 'ordered-list',
};

export const HTMLRenderer: React.FC<{ content: string }> = ({ content }) => (
  <StyledHTMLRenderer className="html-renderer" dangerouslySetInnerHTML={{ __html: content }} />
);

const ToolbarComponent: React.FC<any> = (props) => {
  const { config, onChange, currentState } = props;
  return config.options.map((option: string, idx: number) => (
    <Tooltip
      key={`${option}-${idx}`}
      placement="bottom"
      title={(
        <Text style={{ fontSize: 12 }} className="text-capitalize text-white">
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

const EmojiComponent: React.FC<any> = (props) => {
  const { config, onChange } = props;
  const [visibility, setVisibility] = useState(false);
  return (
    <Tooltip
      placement="top"
      title={(
        <Text style={{ fontSize: 12 }} className="text-capitalize text-white">
          Emoji
        </Text>
      )}
    >
      <Popover
        placement="bottom"
        visible={visibility}
        onVisibleChange={value => setVisibility(value)}
        overlayClassName="toolbar-emoji-popover"
        content={(
          <StyledPopoverContentWrapper>
            <ul className="d-flex flex-wrap m-0">
              {config.emojis.map((emoji: string, idx: number) => (
                <li
                  className="fs-16 text-center"
                  key={idx}
                  onClick={() => {
                    onChange(emoji);
                    setVisibility(false);
                  }}
                >
                  {emoji}
                </li>
              ))}
            </ul>
          </StyledPopoverContentWrapper>
        )}
        trigger="click"
      >
        <div className="toolbar-button emoji d-flex align-items-center justify-content-center">
          <span role="img" aria-label="emoji-hovered">😀</span>
        </div>
      </Popover>
    </Tooltip>
  )
}

const AppTextEditor: React.FC<IAppTextEditor> = forwardRef((
  { value, disabled, onChange, placeholder = "Write something here..." }, ref,
) => {
  const editorRef = useRef<any>(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useImperativeHandle(ref, () => ({
    resetEditor: (defaultValue: string) => {
      const initialValue = htmlToDraft(defaultValue);
      const contentState = ContentState.createFromBlockArray(initialValue.contentBlocks);
      const editorInitialState = EditorState.createWithContent(contentState);
      setEditorState(editorInitialState);
    }
  }));

  useEffect(() => {
    const initialValue = htmlToDraft(value);
    const contentState = ContentState.createFromBlockArray(initialValue.contentBlocks);
    const editorInitialState = EditorState.createWithContent(contentState);
    setEditorState(editorInitialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentContentState = editorState.getCurrentContent();
  let placeholderHidden = (!currentContentState.hasText() && currentContentState.getBlockMap().first().getType() !== 'unstyled');

  return (
    <StyledEditorWrapper className={cx({ 'hide-placeholder': placeholderHidden })}>
      <Editor
        ref={editorRef}
        readOnly={disabled}
        placeholder={placeholder}
        wrapperClassName="identifi-editor-wrapper"
        editorClassName="identifi-editor"
        toolbarClassName="identifi-toolbar position-relative"
        editorState={editorState}
        onEditorStateChange={newEditorState => {
          const htmlString = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
          setEditorState(newEditorState);
          onChange(htmlString);
        }}
        toolbar={{
          options: ['inline', 'list', 'emoji'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
            component: ToolbarComponent,
          },
          list: {
            options: ['unordered', 'ordered'],
            component: ToolbarComponent,
          },
          emoji: {
            component: EmojiComponent,
            emojis: [
              '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
              '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
              '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
              '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
              '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
              '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
              '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
              '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
              '✅', '❎', '💯'
            ],
          }
        }}
      />
    </StyledEditorWrapper>
  );
});

export default AppTextEditor;
