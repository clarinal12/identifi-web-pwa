import React, { ReactNode } from 'react';
import cx from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

import { CheckInScheduleConsumer } from 'contexts/CheckInScheduleContext';
import { UserConsumer } from 'contexts/UserContext';
import { MembersConsumer } from 'contexts/MembersContext';
import { OneOnOneConsumer } from 'contexts/OneOnOneContext';
import { getDisplayName } from 'utils/userUtils';

type TSegmentWithSubmenu = {
  routeSegment: string,
  SubMenu: ReactNode,
}

const CheckInCardsMenu: React.FC<RouteComponentProps<{ checkin_id: string }>> = ({ match, location }) => (
  <CheckInScheduleConsumer>
    {({ checkInCards }) => (
      <Menu
        prefixCls="ignore-class"
        className="ant-dropdown-menu ant-dropdown-menu-light ant-dropdown-menu-root ant-dropdown-menu-vertical breadcrumb-menu"
      >
        {checkInCards.allCheckIns.map(({ scheduleId, name }) => (
          <Menu.Item
            id={scheduleId}
            key={scheduleId}
            className={cx({
              "ant-dropdown-menu-item": true,
              "ant-dropdown-menu-item-active ant-dropdown-menu-item-selected": match.params.checkin_id === scheduleId,
            })}
          >
            <Link
              to={{
                pathname: `/checkins/${scheduleId}`,
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
const CheckInCardsMenuWithRouter = withRouter(CheckInCardsMenu);

const ProfilesMenu: React.FC<RouteComponentProps<{ profile_id: string }>> = ({ match, location }) => (
  <MembersConsumer>
    {({ members }) => (
      <UserConsumer>
        {({ account }) => {
          if (!account) return null;
          return (
            <Menu
              prefixCls="ignore-class"
              className="ant-dropdown-menu ant-dropdown-menu-light ant-dropdown-menu-root ant-dropdown-menu-vertical breadcrumb-menu"
            >
              {members.filter(({ id }) => id !== account.id ).map((member) => (
                <Menu.Item
                  id={member.id}
                  key={member.id}
                  className={cx({
                    "ant-dropdown-menu-item": true,
                    "ant-dropdown-menu-item-active ant-dropdown-menu-item-selected": match.params.profile_id === member.id,
                  })}
                >
                  <Link
                    to={{
                      pathname: `/profile/${member.id}`,
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

const OneOnOnesMenu: React.FC<RouteComponentProps<{ schedule_id: string }>> = ({ match, location }) => (
  <OneOnOneConsumer>
    {({ oneOnOnes }) => (
      <UserConsumer>
        {({ account }) => {
          if (!account) return null;
          return (
            <Menu
              prefixCls="ignore-class"
              className="ant-dropdown-menu ant-dropdown-menu-light ant-dropdown-menu-root ant-dropdown-menu-vertical breadcrumb-menu"
            >
              {oneOnOnes.filter(({ info }) => info ).map(({ teammate, info }) => (
                <Menu.Item
                  id={teammate.id}
                  key={teammate.id}
                  className={cx({
                    "ant-dropdown-menu-item": true,
                    "ant-dropdown-menu-item-active ant-dropdown-menu-item-selected": match.params.schedule_id === info?.scheduleId,
                  })}
                >
                  <Link
                    to={{
                      pathname: `/1-on-1s/${info?.scheduleId}/${info?.currentSessionId}`,
                      state: location.state,
                    }}
                  >
                    {getDisplayName(teammate)}
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          )
        }}
      </UserConsumer>
    )}
  </OneOnOneConsumer>
);
const OneOnOnesMenuWithRouter = withRouter(OneOnOnesMenu);

export const ROUTE_SEGMENTS_WITH_BREADCRUMB_MENU: TSegmentWithSubmenu[] = [{
  routeSegment: ':checkin_id',
  SubMenu: <CheckInCardsMenuWithRouter />,
}, {
  routeSegment: ':profile_id',
  SubMenu: <ProfilesMenuWithRouter />,
}, {
  routeSegment: ':schedule_id',
  SubMenu: <OneOnOnesMenuWithRouter />,
}];
