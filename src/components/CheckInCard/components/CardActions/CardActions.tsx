import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Dropdown, Menu, Popconfirm, Typography, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

import { useUserContextValue } from 'contexts/UserContext';
import { useMessageContextValue } from 'contexts/MessageContext';
import { CHECKIN_SCHEDULES } from 'apollo/queries/checkin';
import { DELETE_CHECKIN_SCHEDULE } from 'apollo/mutations/checkin';

const { Title, Text } = Typography;

interface IMenuOverlay {
  id: string,
  name: string,
  isOwner: boolean,
  setVisible: (state: boolean) => void,
  deleteAction: () => void,
}

interface ICardActions {
  id: string,
  name: string,
  isOwner: boolean,
  setCardLoadingState: (state: boolean) => void,
  isLastItem: boolean,
}

const MenuOverlay: React.FC<IMenuOverlay> = ({ id, name, isOwner, setVisible, deleteAction }) => (
  <Menu
    onClick={({ key, domEvent }: ClickParam) => {
      domEvent.stopPropagation();
      if (+key !== 2) {
        setVisible(false);
      }
    }}
  >
    <Menu.Item key={0}>
      <a href="#!">Deactivate</a>
    </Menu.Item>
    <Menu.Item key={1}>
      <Link
        to={{
          pathname: `/checkins/${id}/edit`,
          state: { id_alias: name },
        }}
      >
        Edit
      </Link>
    </Menu.Item>
    {isOwner && (
      <Menu.Item key={2}>
        <Popconfirm
          title={<>
            <Title style={{ fontSize: 16 }}>Delete Check-in?</Title>
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
  isOwner, id, name, setCardLoadingState, isLastItem,
}) => {
  const { account } = useUserContextValue();
  const [deleteCheckInSchedule] = useMutation(DELETE_CHECKIN_SCHEDULE);
  const { alertError, alertWarning } = useMessageContextValue();
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

  return (
    <Dropdown
      placement="bottomRight"
      overlay={MenuOverlay({
        id,
        name,
        deleteAction,
        setVisible,
        isOwner,
      })}
      trigger={['click']}
      onVisibleChange={visibility => setVisible(visibility)}
      visible={visible}
    >
      <a className="ant-dropdown-link" href="#!" onClick={(e) => e.stopPropagation()}>
        <Icon type="more" rotate={90} />
      </a>
    </Dropdown>
  );
};

export default CardActions;
