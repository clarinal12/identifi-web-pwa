import React from 'react';
import cx from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Icon, Typography, Row, Col, List } from 'antd';

import { ICheckinData } from 'apollo/types/graphql-types';
import { scrollToTop } from 'utils/scrollUtils';

const { Title, Text } = Typography;

const PastClockIcon = () => (
  <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.5">
      <path
        fill="#BFC5D0"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.7127 45.5066C15.7127 26.3587 31.5239 10.8508 50.8235 11.3816C68.6064 11.8746 83.4697 26.7379 83.9627 44.5208C84.4935 63.8204 68.9856 79.6316 49.8377 79.6316C41.9131 79.6316 34.671 76.9396 28.9077 72.3896C27.1256 71.0246 27.0118 68.3325 28.6043 66.74C29.9693 65.375 32.0927 65.2612 33.6093 66.4366C38.0835 69.9629 43.7331 72.0483 49.8377 72.0483C64.6252 72.0483 76.5689 59.9529 76.3793 45.1275C76.1897 31.0225 64.3218 19.1546 50.2168 18.965C35.3535 18.7754 23.296 30.7191 23.296 45.5066H30.0831C31.7893 45.5066 32.6235 47.5541 31.4481 48.7296L20.8693 59.3462C20.111 60.1046 18.9356 60.1046 18.1772 59.3462L7.59849 48.7296C6.38516 47.5541 7.21933 45.5066 8.92558 45.5066H15.7127ZM46.046 33.1837C46.046 31.6291 47.3352 30.34 48.8897 30.34C50.4443 30.34 51.7335 31.6291 51.7335 33.1458V46.0375L62.6535 52.5212C63.9806 53.3175 64.4356 55.0616 63.6393 56.4266C62.8431 57.7537 61.0989 58.2087 59.7339 57.4125L47.9039 50.3979C46.7664 49.7154 46.046 48.4641 46.046 47.1371V33.1837Z"
      />
    </g>
  </svg>
);

interface IPastCheckInList extends RouteComponentProps<{ checkin_id: string }> {
  data: ICheckinData,
  pastCheckInId: string,
  setPastCheckInId: (id: string) => void,
}

const StyledListWrapper = styled.div`
  max-height: 250px;
  overflow: auto;

  /* total width */
  &::-webkit-scrollbar {
    width: 0 !important;
  }

  /* scrollbar itself */
  &::-webkit-scrollbar-thumb {
    background-color: #babac0 !important;
    border-radius: 0 !important;
    border: none !important;
  }

  /* set button(top and bottom of the scrollbar) */
  &::-webkit-scrollbar-button {
    display: none !important;
  }

  .ant-list-item {
    padding: 8px 0 !important;
    &:hover {
      cursor: pointer;
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
  <StyledEmptyRow className="d-flex">
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
