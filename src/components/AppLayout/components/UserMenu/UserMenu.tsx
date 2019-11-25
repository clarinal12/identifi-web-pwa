import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Dropdown, Menu, Avatar, Typography } from 'antd';
import { useUserContextValue } from 'contexts/UserContext';

const { Text } = Typography;

const menu = ({ redirectToLogin }: { redirectToLogin: () => void }) => (
  <Menu style={{ minWidth: 150 }}>
    <Menu.Item
      key={0}
      onClick={redirectToLogin}
    >
      Logout
    </Menu.Item>
  </Menu>
); 

const UserMenu: React.FC<RouteComponentProps> = ({ history }) => {
  const { account } = useUserContextValue();
  const nameString = account && account.firstname && account.lastname ?
    `${account.firstname} ${account.lastname}` : (account || { email: undefined }).email;
  return (
    <Dropdown
      className="float-right"
      overlay={menu({
        redirectToLogin: () => {
          localStorage.clear();
          history.push('/login');
        },
      })}
      trigger={['click']}
    >
      <a href="#!">
        <Avatar className="mr-2" icon="user" />
        <Text>{nameString}</Text>
      </a>
    </Dropdown>
  );
};

export default withRouter(UserMenu);
