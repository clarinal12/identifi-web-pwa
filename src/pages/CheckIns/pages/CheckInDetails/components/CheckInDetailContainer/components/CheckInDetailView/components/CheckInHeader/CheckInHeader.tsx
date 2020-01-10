import React from 'react';
import cx from 'classnames';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { Card, Typography, Icon, Button, Tag, Row, Col, Avatar, Tooltip } from 'antd';

import { COLOR_MAP } from 'utils/colorUtils';
import { IAccount, TCurrentCheckIn } from 'apollo/types/graphql-types';

const { Title, Text } = Typography;

interface ICheckInHeader extends RouteComponentProps<{ checkin_id: string }> {
  data: TCurrentCheckIn,
  checkInName: string,
  checkInState: string,
}

const AvatarWrapper = styled.div`
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
            <Avatar {...(avatar && { src : avatar })} />
          </Link>
        </Tooltip>
      );
    })}
  </>
};

const CheckInHeader: React.FC<ICheckInHeader> = ({ data, checkInName, checkInState, match }) => {
  return (
    <Card style={{ background: '#006D75' }} className="mb-3">
      <div className="d-flex mb-2" style={{ justifyContent: 'space-between' }}>
        <div className="d-flex" style={{ alignItems: 'center' }}>
          <Title className="mb-0 mr-3" level={3} style={{ color: '#FFFFFF' }}>
            {checkInName}
          </Title>
          <div>
            <Tag color={COLOR_MAP[checkInState]}>
              <Text>{checkInState}</Text>
            </Tag>
          </div>
        </div>
        <Link to={`/checkins/${match.params.checkin_id}/edit`}>
          <Button
            type="link"
            htmlType="button"
            size="large"
            className="p-0"
            style={{ fontSize: 20, color: '#E6FFFB' }}
          >
            <Icon type="setting" />
          </Button>
        </Link>
      </div>
      <Row>
        <Col xs={12}>
          <Text className="fs-16" style={{ color: '#E6FFFB' }}>
            {moment(data.date).format('MMM DD, hh:mm a')}
          </Text>
        </Col>
        <Col xs={12}>
          <AvatarWrapper className="float-right d-flex">
            <div
              className={cx({
                'active-avatars': true,
                'mr-3': data.notSubmitted.length > 0,
              })}
            >
              <StackedAvatars source={data.submitted} />
            </div>
            <div className="inactive-avatars">
              <StackedAvatars source={data.notSubmitted} />
            </div>
          </AvatarWrapper>
        </Col>
      </Row>
    </Card>
  );
}

export default withRouter(CheckInHeader);
