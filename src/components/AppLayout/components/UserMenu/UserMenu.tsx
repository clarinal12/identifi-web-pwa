import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Dropdown, Menu, Avatar, Typography } from 'antd';

import { useUserContextValue } from 'contexts/UserContext';
import { getDisplayName } from 'utils/userUtils';

const { Text } = Typography;

interface IMenu {
  redirectToLogin: () => void,
  goToProfile: () => void,
}

const MenuOptions: React.FC<IMenu> = ({ redirectToLogin, goToProfile }) => (
  <Menu style={{ minWidth: 150 }}>
    <Menu.Item
      key={0}
      onClick={goToProfile}
    >
      Profile
    </Menu.Item>
    <Menu.Item
      key={1}
      onClick={redirectToLogin}
    >
      Logout
    </Menu.Item>
  </Menu>
); 

const UserMenu: React.FC<
  RouteComponentProps & WithApolloClient<Omit<RouteComponentProps, 'client'>>
> = ({ history, client }) => {
  const { account, setUserState } = useUserContextValue();
  const nameString = getDisplayName(account);
  return (
    <Dropdown
      className="float-right"
      overlay={MenuOptions({
        goToProfile: () => {
          history.push('/profile');
        },
        redirectToLogin: () => {
          if (setUserState) {
            setUserState({
              account: undefined,
              token: undefined,
              authenticated: false,
            });
          }
          localStorage.clear();
          history.push('/login');
          client.resetStore();
        },
      })}
      trigger={['click']}
    >
      <a href="#!">
        <Avatar
          className="mr-2"
          {...(account?.avatar ? {
            src: account.avatar,
          } : {
            icon: 'user',
          })}
        />
        <Text>{nameString}</Text>
      </a>
    </Dropdown>
  );
};

export default withRouter(
  withApollo<RouteComponentProps & WithApolloClient<Omit<RouteComponentProps, 'client'>>>(UserMenu)
);
