import React, { useState } from 'react';
import { Menu, Typography, Dropdown } from 'antd';

import DeleteModal from './components/DeleteModal';
import { MoreVertIcon } from 'utils/iconUtils';

const { Text } = Typography;

interface IDropdownMenu {
  setVisibility: (visibility: boolean) => void,
  editAction: () => void,
  updateProgressAction: () => void,
}

interface IGoalActions {
  memberId: string,
  goalId: string,
  editAction: () => void,
  updateProgressAction: () => void,
}

const DropdownMenu: React.FC<IDropdownMenu> = ({ setVisibility, editAction, updateProgressAction }) => {
  return (
    <Menu>
      <Menu.Item key="0" onClick={editAction}>
        <Text>Edit</Text>
      </Menu.Item>
      <Menu.Item key="1" onClick={updateProgressAction}>
        <Text>Update progress</Text>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setVisibility(true)}>
        <Text type="danger">Delete</Text>
      </Menu.Item>
    </Menu>
  );
}

const GoalActions: React.FC<IGoalActions> = ({ goalId, editAction, memberId, updateProgressAction }) => {
  const [visibility, setVisibility] = useState(false);
  return (
    <>
      <Dropdown
        placement="bottomRight"
        overlay={DropdownMenu({
          setVisibility,
          editAction,
          updateProgressAction,
        })}
        trigger={['click']}
      >
        <a href="#!" className="d-flex">
          <MoreVertIcon />
        </a>
      </Dropdown>
      <DeleteModal
        memberId={memberId}
        goalId={goalId}
        visibility={visibility}
        setVisibility={setVisibility}
      />
    </>
  );
}

export default GoalActions;
