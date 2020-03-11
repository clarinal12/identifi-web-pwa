import React from 'react';
import cx from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Icon, Typography, Row, Col, List } from 'antd';

import { ICheckinData } from 'apollo/types/checkin';
import { scrollToTop } from 'utils/scrollUtils';
import { PastClockIcon } from 'utils/iconUtils';

const { Title, Text } = Typography;

interface IPastCheckInList extends RouteComponentProps<{ checkin_id: string }> {
  data: ICheckinData,
  pastCheckInId: string,
  setPastCheckInId: (id: string) => void,
}

const StyledListWrapper = styled.div`
  max-height: 250px;
  overflow: hidden;

  &:hover {
    overflow: auto;
    &::-webkit-scrollbar-thumb {
      display: block;
    }
    .ant-list-item {
      width: calc(100% - 1px);
    }
  }

  /* total width */
  &::-webkit-scrollbar {
    width: 6px !important;
  }

  /* scrollbar itself */
  &::-webkit-scrollbar-thumb {
    background-color: #babac0 !important;
    border-radius: 12px !important;
    border: none !important;
    display: none;
  }

  /* set button(top and bottom of the scrollbar) */
  &::-webkit-scrollbar-button {
    display: none !important;
  }

  .ant-list-item {
    padding: 8px 16px !important;
    &.active {
      border-left: 4px solid #08979C;
      background: #E6FFFB;
      .list-content-wrapper {
        .ant-typography, .anticon-right {
          color: #08979C;
        }
      }
    }
    &:hover {
      cursor: pointer;
      &:not(.active) {
        background: #F5F5F5;
      }
    }
    .list-content-wrapper {
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

const StyledEmptyRow = styled(Row)`
  min-height: 250px;
  justify-content: center;
  align-items: center;
`;

const EmptyState = () => (
  <StyledEmptyRow className="d-flex px-3">
    <Col className="text-center">
      <PastClockIcon />
      <Title className="mt-4 fs-16">No past check-ins yet</Title>
      <Text type="secondary">
        Once you go through your first cycle for this check-in, all past check-ins will appear here.
      </Text>
    </Col>
  </StyledEmptyRow>
);

const PastCheckInList: React.FC<IPastCheckInList> = ({
  data, match, history, location, setPastCheckInId, pastCheckInId,
}) => {
  const { name, pastCheckIns, currentCheckIn } = data;
  return (pastCheckIns.length > 0) ? (
    <StyledListWrapper>
      <List
        size="large"
        dataSource={[{ date: '', id: '' }].concat(pastCheckIns)}
        renderItem={({ date, id }) => {
          const isActive = (id === pastCheckInId);
          const isPastCheckIn = (date && id);
          const dateString = isPastCheckIn ?
            moment(date).format('MMM DD, YYYY hh:mm A') : moment(currentCheckIn.date).calendar();
          return (
            <List.Item
              className={cx({ active: isActive })}
              key={id}
              onClick={() => {
                scrollToTop();
                setPastCheckInId(id);
                if (isPastCheckIn) {
                  history.push({
                    pathname: `/checkins/${match.params.checkin_id}/${id}`,
                    state: {
                      ...location.state,
                      past_checkin_id_alias: moment(date).format('MMM DD, YYYY'),
                    },
                  });
                } else {
                  history.push({
                    pathname: `/checkins/${match.params.checkin_id}`,
                    state: {
                      checkin_id_alias: name,
                    },
                  });
                }
              }}
            >
              <div className="d-flex list-content-wrapper">
                <Text
                  type={isActive ? undefined : 'secondary'}
                  strong={isActive}
                >
                  {dateString}
                </Text>
                <Icon className="float-right" type="right" />
              </div>
            </List.Item>
          );
        }}
      />
    </StyledListWrapper>
  ) : (
    <EmptyState />
  );
};

export default withRouter(PastCheckInList);
