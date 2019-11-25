import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Icon, Typography, Row, Col, Avatar, Tooltip } from 'antd';

import { TCurrentCheckIn, IAccount } from 'apollo/types/graphql-types';
import RespondentCard from './components/RespondentCard';

const { Title, Text } = Typography;

interface ICheckInDetailView {
  data: TCurrentCheckIn,
}

const StyledEmptyRow = styled(Row)`
  min-height: 350px;
  justify-content: center;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  .active-avatars, .inactive-avatars {
    .ant-avatar {
      cursor: pointer;
      &:not(:first-of-type) {
        border: 1px solid #F5F5F5;
        margin-left: -10px;
      }
    }
  }
`;

const EmptyState = () => (
  <StyledEmptyRow className="d-flex">
    <Col sm={6} className="text-center">
      <Icon type="message" style={{ fontSize: 75, color: '#DADADA' }} />
      <Title className="mt-4" level={2}>No replies yet</Title>
      <Text>Once replies start coming in they’ll appear here.</Text>
    </Col>
  </StyledEmptyRow>
);

const StackedAvatars: React.FC<{ source: IAccount[] }> = ({ source }) => {
  return <>
    {source.map(({ id, email, firstname, lastname }) => {
      const derivedLabel = (firstname && lastname) ? `${firstname} ${lastname}` : email;
      return (
        <Tooltip key={id} placement="topRight" title={derivedLabel}>
          <Avatar>
            {derivedLabel.split(" ").map(v => v.charAt(0).toUpperCase())}
          </Avatar>
        </Tooltip>
      );
    })}
  </>
};

const CheckInDetailView: React.FC<ICheckInDetailView> = ({ data }) => {
  return data ? (
    <>
      <Row className="mb-4 mt-2">
        <Col xs={12}>
          <Title type="secondary" level={4}>{moment(data.date).format('MMM DD, hh:mm A')}</Title>
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
      <div>
        {data.responses.map((response, idx) => (
          <RespondentCard key={idx} response={response} />
        ))}
      </div>
    </>
  ) : (
    <EmptyState />
  );
};

export default CheckInDetailView;
