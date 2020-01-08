import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Dropdown, Menu, Popconfirm, Typography, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

import { useUserContextValue } from 'contexts/UserContext';
import { useMessageContextValue } from 'contexts/MessageContext';
import { CHECKIN_SCHEDULES } from 'apollo/queries/checkin';
import { DELETE_CHECKIN_SCHEDULE, TOGGLE_CHECKIN_STATUS } from 'apollo/mutations/checkin';

const { Title, Text } = Typography;

interface IMenuOverlay {
  id: string,
  name: string,
  active: boolean,
  isOwner: boolean,
  setVisible: (state: boolean) => void,
  deleteAction: () => void,
  toggleCheckInStatus: () => void,
}

interface ICardActions {
  id: string,
  name: string,
  active: boolean,
  isOwner: boolean,
  setCardLoadingState: (state: boolean) => void,
  isLastItem: boolean,
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

const MenuOverlay: React.FC<IMenuOverlay> = ({
  id, name, isOwner, setVisible, deleteAction, toggleCheckInStatus, active,
}) => (
  <Menu
    onClick={({ key, domEvent }: ClickParam) => {
      domEvent.stopPropagation();
      if (+key !== 2) {
        setVisible(false);
      }
    }}
  >
    {isOwner && (
      <Menu.Item
        key={0}
        onClick={toggleCheckInStatus}
      >
        <a href="#!">{active ? 'Deactivate' : 'Activate'}</a>
      </Menu.Item>
    )}
    <Menu.Item key={1}>
      <Link
        to={{
          pathname: `/checkins/${id}/edit`,
          state: { checkin_id_alias: name },
        }}
      >
        Edit
      </Link>
    </Menu.Item>
    {isOwner && (
      <Menu.Item key={2}>
        <Popconfirm
          title={<>
            <Title className="fs-16">Delete Check-in?</Title>
            <Text>Are you sure you want to delete this Check-in?</Text><br />
            <Text>This action cannot be undone.</Text>
          </>}
          icon={<Icon type="question-circle" />}
          okText="Delete"
          okType="danger"
          placement="leftBottom"
          onCancel={() => setVisible(false)}
          onConfirm={deleteAction}
        >
          <a href="#!">
            <Text type="danger">
              Delete
            </Text>
          </a>
        </Popconfirm>
      </Menu.Item>
    )}
  </Menu>
);

const CardActions: React.FC<ICardActions> = ({
  isOwner, id, name, setCardLoadingState, isLastItem, active,
}) => {
  const { account } = useUserContextValue();
  const [deleteCheckInSchedule] = useMutation(DELETE_CHECKIN_SCHEDULE);
  const [toggleCheckInScheduleStatus] = useMutation(TOGGLE_CHECKIN_STATUS);
  const { alertError, alertWarning, alertSuccess } = useMessageContextValue();
  const activeCompany = account && account.activeCompany;

  const [visible, setVisible] = useState(false);

  const deleteAction = async () => {
    setVisible(false);
    setCardLoadingState(true);
    try {
      await deleteCheckInSchedule({
        variables: { id },
        refetchQueries: [{
          query: CHECKIN_SCHEDULES,
          variables: {
            filter: { 
              companyId: activeCompany && activeCompany.id,
            },
          },
        }, {
          query: CHECKIN_SCHEDULES,
          variables: {
            filter: {
              companyId: activeCompany && activeCompany.id,
              participatingOnly: true,
            }
          },
        }],
        awaitRefetchQueries: true,
      });
      alertWarning("A check-in has been deleted");
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    if (!isLastItem) {
      setCardLoadingState(false);
    }
  }

  const toggleCheckInStatus = async () => {
    setCardLoadingState(true);
    try {
      await toggleCheckInScheduleStatus({
        variables: {
          input: {
            id,
            active: !active,
          },
        },
        refetchQueries: [{
          query: CHECKIN_SCHEDULES,
          variables: {
            filter: { 
              companyId: activeCompany && activeCompany.id,
            },
          },
        }],
        awaitRefetchQueries: true,
      });
      const alertMethod = active ? alertWarning : alertSuccess;
      const derivedAction = active ? 'deactivated' : 'activated';
      alertMethod(`A check-in has been ${derivedAction}`);
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setCardLoadingState(false);
  }

  return (
    <Dropdown
      placement="bottomRight"
      overlay={MenuOverlay({
        id,
        name,
        active,
        deleteAction,
        toggleCheckInStatus,
        setVisible,
        isOwner,
      })}
      trigger={['click']}
      onVisibleChange={visibility => setVisible(visibility)}
      visible={visible}
    >
      <a className="ant-dropdown-link" href="#!" onClick={(e) => e.stopPropagation()}>
        <MoreVertIcon />
      </a>
    </Dropdown>
  );
};

export default CardActions;
