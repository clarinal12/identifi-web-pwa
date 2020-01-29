import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Row, Col, Typography, Avatar, Tooltip } from 'antd';

import { IAccount, TCheckInStats } from 'apollo/types/graphql-types';

const { Title, Text } = Typography;

interface ICheckInStats {
  goals: TCheckInStats,
  blockers: TCheckInStats,
  checkins: TCheckInStats,
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
    }
  }
  .active-avatars {
    .ant-avatar {
      border: 1.5px solid #FFFFFF;
    }
  }
  .inactive-avatars {
    .ant-avatar {
      filter: grayscale(1);
    }
  }
`;

const StackedAvatars: React.FC<{ source: IAccount[] }> = ({ source }) => {
  return <>
    {source.map(({ id, email, firstname, lastname, avatar, memberId }) => {
      const derivedLabel = (firstname && lastname) ? `${firstname} ${lastname}` : email;
      return (
        <Tooltip key={id} placement="topRight" title={derivedLabel}>
          <Link to={`/profile/${memberId}`} className="ant-avatar-link">
            <Avatar size="small" {...(avatar && { src : avatar })} />
          </Link>
        </Tooltip>
      );
    })}
  </>
};

const CheckInStats: React.FC<ICheckInStats> = ({ goals, blockers, checkins }) => {
  return (
    <Row gutter={16} className="mb-3 d-flex">
      <Col lg={8} md={8} xs={24}>
        <StyledCard>
          {checkins && (
            <>
              <div className="stat-wrapper text-center">
                <Text>Checked-in</Text>
                <Title className="my-3">{checkins.percentage}%</Title>
              </div>
              <AvatarWrapper className="d-flex">
                <div className="active-avatars">
                  <StackedAvatars source={checkins.colored} />
                </div>
                <div className="inactive-avatars">
                  <StackedAvatars source={checkins.faded} />
                </div>
              </AvatarWrapper>
            </>
          )}
        </StyledCard>
      </Col>
      {goals && (
        <Col lg={8} md={8} xs={24}>
          <StyledCard>
            <div className="stat-wrapper text-center">
              <Text>Completed goals</Text>
              <Title className="my-3" style={{ color: '#08979C' }}>{goals.percentage}%</Title>
            </div>
            <AvatarWrapper className="d-flex">
              <div className="active-avatars">
                <StackedAvatars source={goals.colored} />
              </div>
              <div className="inactive-avatars">
                <StackedAvatars source={goals.faded} />
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
