import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { Card, Icon, Tag, Typography, Row, Col, Spin } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';
import CardActions from './components/CardActions';
import { ICheckinData } from 'apollo/types/checkin';
import { useUserContextValue } from 'contexts/UserContext';
import { COLOR_MAP } from 'utils/colorUtils';

const { Title, Text } = Typography;

interface ICheckinCard extends RouteComponentProps {
  item: ICheckinData,
  isLastItem: boolean,
}

const StyledCard = styled(Card)`
  flex-direction: column;
  .ant-card-head {
    padding: 0 16px;
    border-bottom: none;
    .ant-card-head-title, .ant-card-extra {
      padding-bottom: 0;
    }
  }
  .ant-card-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 8px 16px 16px 16px;
    .organization-block {
      flex-grow: 1;
      align-items: flex-start;
      svg {
        height: 18px;
        width: 18px;
        margin-right: 4px;
      }
    }
    .push-bottom {
      .anticon, .ant-typography {
        color: #8C8C8C;
      }
      .ant-typography {
        font-size: 12px;
      }
    }
  }
`;

const CheckInCard: React.FC<ICheckinCard> = ({
  item: { scheduleId, status, name, frequency, nextCheckInDate, replies },
  isLastItem, history,
}) => {
  const { account } = useUserContextValue();
  const [cardLoadingState, setCardLoadingState] = useState(false);
  const derivedTimezone = account?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <Spin spinning={cardLoadingState} indicator={LoadingIcon}>
      <StyledCard
        hoverable
        onClick={() => history.push({
          pathname: `/checkins/${scheduleId}`,
          state: { checkin_id_alias: name },
        })}
        className="d-flex"
        title={<Tag style={{ color: '#595959' }} color={COLOR_MAP[status]}>{status}</Tag>}
        {...(account?.isOwner && {
          extra: (
            <CardActions
              id={scheduleId}
              name={name}
              active={status !== 'DEACTIVATED'}
              isLastItem={isLastItem}
              setCardLoadingState={setCardLoadingState}
            />
          ),
        })}
      >
        <Title ellipsis level={4} className="mb-2">{name}</Title>
        <div className="replies-block mb-3">
          {replies && (
            <Text style={{ fontSize: 12 }}>
              Replies: {replies.total} of {replies.expected}
            </Text>
          )}
        </div>
        <Row className="push-bottom">
          <Col xs={16}>
            <Icon type="clock-circle" className="mr-2" />
            <Text>{moment(nextCheckInDate).tz(derivedTimezone).format('MMM DD, hh:mm A')}</Text>
          </Col>
          <Col xs={8} className="text-right">
            <Icon type="reload" className="mr-2" />
            <Text>{frequency}</Text>
          </Col>
        </Row>
      </StyledCard>
    </Spin>
  );
};

export default withRouter(CheckInCard);
