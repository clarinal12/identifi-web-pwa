import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Typography, Row, Col, Avatar, Tooltip } from 'antd';

import { TCurrentCheckIn, IAccount } from 'apollo/types/graphql-types';
import RespondentCard from './components/RespondentCard';

const { Title, Text } = Typography;

const IconMessage = () => (
  <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.5">
      <path fillRule="evenodd" clipRule="evenodd" d="M15.1666 7.58337H75.8333C80.0041 7.58337 83.4166 10.9959 83.4166 15.1667V60.6667C83.4166 64.8375 80.0041 68.25 75.8333 68.25H22.7499L7.58325 83.4167L7.62117 15.1667C7.62117 10.9959 10.9958 7.58337 15.1666 7.58337ZM26.5416 41.7084H34.1249V34.125H26.5416V41.7084ZM49.2916 41.7084H41.7083V34.125H49.2916V41.7084ZM56.8749 41.7084H64.4582V34.125H56.8749V41.7084Z" fill="#BFC5D0"/>
    </g>
  </svg>
);

interface ICheckInDetailView {
  done?: boolean,
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
        border: 1.5px solid #F5F5F5;
        margin-left: -10px;
      }
    }
  }
`;

const EmptyState = ({ done = false }: { done?: boolean }) => (
  <StyledEmptyRow className="d-flex">
    <Col sm={6} className="text-center">
      <IconMessage />
      <Title className="mt-4" level={2}>No replies {done ? '' : 'yet'}</Title>
      {!done && <Text>Once replies start coming in they’ll appear here.</Text>}
    </Col>
  </StyledEmptyRow>
);

const StackedAvatars: React.FC<{ source: IAccount[] }> = ({ source }) => {
  return <>
    {source.map(({ id, email, firstname, lastname, avatar }) => {
      const derivedLabel = (firstname && lastname) ? `${firstname} ${lastname}` : email;
      return (
        <Tooltip key={id} placement="topRight" title={derivedLabel}>
          <Avatar
            {...(avatar && { src : avatar })}
          />
        </Tooltip>
      );
    })}
  </>
};

const CheckInDetailView: React.FC<ICheckInDetailView> = ({ data, done }) => {
  return data ? (
    <>
      <Row className="mb-4 mt-2">
        <Col xs={12}>
          <Title type="secondary" level={4}>{moment(data.date).format('MMM DD, hh:mm a')}</Title>
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
      {(data.responses.length > 0) ? (
        <div>
          {data.responses.map((response, idx) => (
            <RespondentCard key={idx} response={response} />
          ))}
        </div>
      ) : (
        <EmptyState done />
      )}
    </>
  ) : (
    <EmptyState />
  );
};

export default CheckInDetailView;
