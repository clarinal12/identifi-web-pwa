import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { Card, Icon, Tag, Typography, Row, Col, Spin } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';
import CardActions from './components/CardActions';
import { ICheckinData } from 'apollo/types/graphql-types';
import { useUserContextValue } from 'contexts/UserContext';
import { COLOR_MAP } from 'utils/colorUtils';

const { Title, Text } = Typography;

interface ICheckinCard extends RouteComponentProps {
  item: ICheckinData,
  isLastItem: boolean,
}

const StyledCard = styled(Card)`
  flex-direction: column;
  min-height: 185px;
  .ant-card-head {
    padding: 0 16px;
    border-bottom: none;
    .ant-card-head-title, .ant-card-extra {
      padding-bottom: 0;
    }
    .ant-card-extra {
      position: relative;
      .ant-dropdown-trigger {
        color: #8C8C8C;
        position: absolute;
        top: 0px;
        right: 0px;
        svg {
          width: 25px;
          height: 25px;
        }
      }
    }
  }
  .ant-card-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 8px 16px 16px 16px;
    .replies-block {
      flex-grow: 1;
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
  item: { id, status, name, frequency, nextCheckInDate, replies, timezone },
  isLastItem, history,
}) => {
  const { account } = useUserContextValue();
  const [cardLoadingState, setCardLoadingState] = useState(false);
  const { memberInfo } = account || { memberInfo: { memberId: '', isOwner: false } };
  const derivedTimezone = account ? account.timezone : timezone;

  return (
    <Spin spinning={cardLoadingState} indicator={LoadingIcon}>
      <StyledCard
        hoverable
        onClick={() => history.push({
          pathname: `/checkins/${id}`,
          state: {
            checkin_id_alias: name,
          },
        })}
        className="d-flex"
        title={<Tag style={{ color: '#595959' }} color={COLOR_MAP[status]}>{status}</Tag>}
        extra={(
          <CardActions
            id={id}
            name={name}
            active={status !== 'DEACTIVATED'}
            isLastItem={isLastItem}
            isOwner={memberInfo.isOwner}
            setCardLoadingState={setCardLoadingState}
          />
        )}
      >
        <Title level={4} className="mb-2">{name}</Title>
        <div className="replies-block">
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
