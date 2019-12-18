import React, { useState } from 'react';
import { Menu, Typography, Dropdown } from 'antd';

import DeleteModal from './components/DeleteModal';

const { Text } = Typography;

interface IDropdownMenu {
  setVisibility: (visibility: boolean) => void,
}

interface ICommentActions {
  commentId: string,
  responseId: string,
}

const MoreVertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12Z"
      fill="black"
      fillOpacity="0.54"
    />
  </svg>
);

const DropdownMenu: React.FC<IDropdownMenu> = ({ setVisibility }) => {
  return (
    <Menu>
      <Menu.Item key="0">
        <Text>Edit</Text>
      </Menu.Item>
      <Menu.Item key="1" onClick={() => setVisibility(true)}>
        <Text>Delete</Text>
      </Menu.Item>
    </Menu>
  );
}

const CommentActions: React.FC<ICommentActions> = ({ commentId, responseId }) => {
  const [visibility, setVisibility] = useState(false);
  return (
    <>
      <Dropdown
        placement="bottomRight"
        overlay={DropdownMenu({ setVisibility })}
        trigger={['click']}
      >
        <a href="#!">
          <MoreVertIcon />
        </a>
      </Dropdown>
      <DeleteModal
        commentId={commentId}
        responseId={responseId}
        visibility={visibility}
        setVisibility={setVisibility}
      />
    </>
  );
}

export default CommentActions;
