import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

interface IAppRoute {
  label: string,
  icon: any,
  route: string,
}

const StyledMenu = styled(Menu)`
  .ant-menu-item {
    &:last-of-type {
      position: absolute;
      bottom: 24px;
    }
    &.ant-menu-item-selected {
      background: rgba(244, 248, 249, 0.1) !important;
      border-right: 3px solid #13C2C2 !important;
      .anticon, span {
        color: #13C2C2 !important;
      }
    }
  }
`;

const APP_ROUTES: IAppRoute[] = [{
  label: 'Check-ins',
  icon: <Icon type="flag" />,
  route: '/checkins',
}, {
  label: 'People',
  icon: <Icon type="team" />,
  route: '/people',
},
{
  label: 'Links Directory',
  icon: <Icon type="link" />,
  route: '/links',
},
{
  label: '1-on-1s',
  icon: <Icon type="team" />,
  route: '/1-on-1s',
},
{
  label: 'Settings',
  icon: <Icon type="setting" />,
  route: '/settings',
}];

const AppMenu: React.FC<RouteComponentProps> = ({ location, history }) => {
  const currentRouteIndex = APP_ROUTES.findIndex(({ route }: IAppRoute) => location.pathname.includes(route));

  const menuClickHandler = ({ key }: ClickParam) => {
    history.push(APP_ROUTES[+key].route)
  };

  return (
    <StyledMenu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[currentRouteIndex.toString()]}
      onClick={menuClickHandler}
    >
      {APP_ROUTES.map(({ label, icon, route }, idx) => (
        <Menu.Item key={idx}>
          {icon}
          <span>{label}</span>
        </Menu.Item>
      ))}
    </StyledMenu>
  );
}

export default withRouter(AppMenu);
