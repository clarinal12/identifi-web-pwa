import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, Typography, Icon, Button, Tag, Row, Col, Avatar, Tooltip } from 'antd';

import { COLOR_MAP } from 'utils/colorUtils';
import { IAccount, TCurrentCheckIn } from 'apollo/types/graphql-types';

const { Title, Text } = Typography;

interface ICheckInHeader extends RouteComponentProps<{ id: string }> {
  data: TCurrentCheckIn,
  checkInName: string,
  checkInState: string,
}

const AvatarWrapper = styled.div`
  .active-avatars, .inactive-avatars {
    .ant-avatar {
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
    {source.map(({ id, email, firstname, lastname, avatar }) => {
      const derivedLabel = (firstname && lastname) ? `${firstname} ${lastname}` : email;
      return (
        <Tooltip key={id} placement="topRight" title={derivedLabel}>
          <Avatar {...(avatar && { src : avatar })} />
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
        <Link to={`/checkins/${match.params.id}/edit`}>
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
          <Text style={{ fontSize: 16, color: '#E6FFFB' }}>
            {moment(data.date).format('MMM DD, hh:mm a')}
          </Text>
        </Col>
        <Col xs={12}>
          <AvatarWrapper className="float-right d-flex">
            <div className="mr-3 active-avatars">
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
