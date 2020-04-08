import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Row, Col, Typography, Avatar, Tooltip } from 'antd';

import { TCheckInStats } from 'apollo/types/checkin';
import { IAccount } from 'apollo/types/user';
import { getDisplayName } from 'utils/userUtils';

const { Title, Text } = Typography;

interface ICheckInStats {
  data: {
    completedGoals: TCheckInStats,
    blockers: TCheckInStats,
    checkedIn: TCheckInStats,
  }
}

interface IStackedAvatars {
  source: IAccount[],
  maxDisplay?: number,
}

const StyledCard = styled(Card)`
  height: 100%;
`;

const AvatarWrapper = styled.div`
  justify-content: space-between;
  .active-avatars, .inactive-avatars {
    .ant-avatar-link {
      cursor: pointer;
      &:not(:first-of-type) {
        margin-left: -10px;
      }
      .ant-avatar {
        border: 1.5px solid #FFFFFF;
        width: 28px;
        height: 28px;
        .ant-avatar-string {
          line-height: 20px;
          .compressed-members {
            font-size: 10px;
          }
        }
      }
    }
  }
  .inactive-avatars {
    .ant-avatar {
      filter: grayscale(1);
    }
  }
`;

const StackedAvatars: React.FC<IStackedAvatars> = ({ source, maxDisplay = 3 }) => {
  const avatarList = [...source].splice(0, maxDisplay);
  const tooltipList = [...source].splice(maxDisplay);
  return <>
    {avatarList.map(({ id, email, firstname, lastname, avatar }) => {
      const derivedLabel = (firstname && lastname) ? `${firstname} ${lastname}` : email;
      return (
        <Tooltip key={id} placement="topRight" title={derivedLabel}>
          <Link to={`/profile/${id}`} className="ant-avatar-link">
            <Avatar {...(avatar && { src : avatar })} />
          </Link>
        </Tooltip>
      );
    })}
    {(tooltipList.length > 0) && (
      <Tooltip
        placement="topRight"
        title={<>
          {tooltipList.map((user, idx) => (
            <Text className="d-block" key={idx}>
              <Link to={`/profile/${user.id}`} style={{ color: '#FFF' }}>
                {getDisplayName(user)}
              </Link>
            </Text>
          ))}
        </>}
      >
        <a href="#!" className="ant-avatar-link">
          <Avatar>
            <Text className="compressed-members" type="secondary">+{tooltipList.length}</Text>
          </Avatar>
        </a>      
      </Tooltip>    
    )}
  </>
};

const CheckInStats: React.FC<ICheckInStats> = ({ data }) => {
  const { completedGoals, blockers, checkedIn } = data;
  return (
    <Row gutter={16} className="mb-3 d-flex">
      <Col lg={8} md={8} xs={24}>
        <StyledCard>
          {checkedIn && (
            <>
              <div className="stat-wrapper text-center">
                <Text>Checked-in</Text>
                <Title className="my-3">{checkedIn.percentage}%</Title>
              </div>
              <AvatarWrapper className="d-flex">
                <div className="active-avatars">
                  <StackedAvatars source={checkedIn.colored} />
                </div>
                <div className="inactive-avatars">
                  <StackedAvatars source={checkedIn.faded} />
                </div>
              </AvatarWrapper>
            </>
          )}
        </StyledCard>
      </Col>
      {completedGoals && (
        <Col lg={8} md={8} xs={24}>
          <StyledCard>
            <div className="stat-wrapper text-center">
              <Text>Completed goals</Text>
              <Title className="my-3" style={{ color: '#08979C' }}>{completedGoals.percentage}%</Title>
            </div>
            <AvatarWrapper className="d-flex">
              <div className="active-avatars">
                <StackedAvatars source={completedGoals.colored} />
              </div>
              <div className="inactive-avatars">
                <StackedAvatars source={completedGoals.faded} />
              </div>
            </AvatarWrapper>
          </StyledCard>
        </Col>
      )}
      {blockers && (
        <Col lg={8} md={8} xs={24}>
          <StyledCard>
            <div className="stat-wrapper text-center">
              <Text>Blocked</Text>
              <Title className="my-3" type="danger">{blockers.percentage}%</Title>
            </div>
            <AvatarWrapper className="text-center">
              <div className="active-avatars">
                <StackedAvatars source={blockers.colored} />
              </div>
            </AvatarWrapper>
          </StyledCard>
        </Col>
      )}
    </Row>
  );
};

export default CheckInStats;
