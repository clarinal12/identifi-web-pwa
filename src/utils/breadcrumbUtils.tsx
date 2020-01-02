import React, { ReactNode } from 'react';
import cx from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

import { CheckInScheduleConsumer } from 'contexts/CheckInScheduleContext';
import { UserConsumer } from 'contexts/UserContext';
import { MembersConsumer } from 'contexts/MembersContext';
import { getDisplayName } from 'utils/userUtils';

type TSegmentWithSubmenu = {
  routeSegment: string,
  SubMenu: ReactNode,
}

const CheckInSchedulesMenu: React.FC<RouteComponentProps<{ checkin_id: string }>> = ({ match, location }) => (
  <CheckInScheduleConsumer>
    {({ checkInSchedules }) => (
      <Menu
        prefixCls="ignore-class"
        className="ant-dropdown-menu ant-dropdown-menu-light ant-dropdown-menu-root ant-dropdown-menu-vertical"
      >
        {checkInSchedules.map(({ id, name }) => (
          <Menu.Item
            id={id}
            key={id}
            className={cx({
              "ant-dropdown-menu-item": true,
              "ant-dropdown-menu-item-active ant-dropdown-menu-item-selected": match.params.checkin_id === id,
            })}
          >
            <Link
              to={{
                pathname: `/checkins/${id}`,
                state: location.state,
              }}
            >
              {name}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    )}
  </CheckInScheduleConsumer>
);
const CheckInSchedulesMenuWithRouter = withRouter(CheckInSchedulesMenu);

const ProfilesMenu: React.FC<RouteComponentProps<{ profile_id: string }>> = ({ match, location }) => (
  <MembersConsumer>
    {({ members }) => (
      <UserConsumer>
        {({ account }) => {
          const memberInfo = account && account.memberInfo;
          if (!memberInfo) return null;
          return (
            <Menu
              prefixCls="ignore-class"
              className="ant-dropdown-menu ant-dropdown-menu-light ant-dropdown-menu-root ant-dropdown-menu-vertical"
            >
              {members.filter(({ memberId }) => memberId !== memberInfo.memberId ).map((member) => (
                <Menu.Item
                  id={member.memberId}
                  key={member.memberId}
                  className={cx({
                    "ant-dropdown-menu-item": true,
                    "ant-dropdown-menu-item-active ant-dropdown-menu-item-selected": match.params.profile_id === member.memberId,
                  })}
                >
                  <Link
                    to={{
                      pathname: `/profile/${member.memberId}`,
                      state: location.state,
                    }}
                  >
                    {getDisplayName(member)}
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          )
        }}
      </UserConsumer>
    )}
  </MembersConsumer>
);
const ProfilesMenuWithRouter = withRouter(ProfilesMenu);

export const ROUTE_SEGMENTS_WITH_BREADCRUMB_MENU: TSegmentWithSubmenu[] = [{
  routeSegment: ':checkin_id',
  SubMenu: <CheckInSchedulesMenuWithRouter />,
}, {
  routeSegment: ':profile_id',
  SubMenu: <ProfilesMenuWithRouter />,
}];
