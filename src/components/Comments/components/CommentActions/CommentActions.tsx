import React, { useState } from 'react';
import { Menu, Typography, Dropdown } from 'antd';

import DeleteModal from './components/DeleteModal';
import { MoreVertIcon } from 'utils/iconUtils';

const { Text } = Typography;

interface IDropdownMenu {
  setVisibility: (visibility: boolean) => void,
  setEditCommentId: () => void,
}

interface ICommentActions {
  commentId: string,
  responseId: string,
  setEditCommentId: (commentId: string) => void,
}

const DropdownMenu: React.FC<IDropdownMenu> = ({ setVisibility, setEditCommentId }) => {
  return (
    <Menu>
      <Menu.Item key="0" onClick={setEditCommentId}>
        <Text>Edit</Text>
      </Menu.Item>
      <Menu.Item key="1" onClick={() => setVisibility(true)}>
        <Text type="danger">Delete</Text>
      </Menu.Item>
    </Menu>
  );
}

const CommentActions: React.FC<ICommentActions> = ({ commentId, responseId, setEditCommentId }) => {
  const [visibility, setVisibility] = useState(false);
  return (
    <>
      <Dropdown
        placement="bottomRight"
        overlay={DropdownMenu({
          setVisibility,
          setEditCommentId: () => setEditCommentId(commentId),
        })}
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
