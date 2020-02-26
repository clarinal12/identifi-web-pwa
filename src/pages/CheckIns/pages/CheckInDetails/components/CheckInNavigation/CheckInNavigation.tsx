import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Card, List, Icon, Typography } from 'antd';

import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import { scrollToTop } from 'utils/scrollUtils';

const { Text } = Typography;

const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 0 16px;
    border: none;
  }
  .ant-card-body {
    padding: 0 16px 16px;
  }
`;

const StyledListWrapper = styled.div`
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

const CheckInNavigation: React.FC<RouteComponentProps<{ checkin_id: string }>> = ({
  match, history, location,
}) => {
  const { checkInCards } = useCheckInScheduleContextValue();
  const currentCheckInIndex = checkInCards.allCheckIns.findIndex(({ scheduleId }) => scheduleId === match.params.checkin_id);
  return (checkInCards.allCheckIns.length > 1) ? (
    <>
      {(currentCheckInIndex !== 0) && (
        <StyledCard className="mb-3" title="Previous check-in">
          <StyledListWrapper>
            <List
              size="large"
              dataSource={[checkInCards.allCheckIns[currentCheckInIndex - 1]]}
              renderItem={({ name, scheduleId }) => {
                return (
                  <List.Item
                    key={scheduleId}
                    onClick={() => {
                      scrollToTop();
                      history.push({
                        pathname: `/checkins/${scheduleId}`,
                        state: {
                          checkin_id_alias: name,
                        },
                      });
                    }}
                  >
                    <div className="d-flex list-content-wrapper">
                      <Text>{name}</Text>
                      <Icon className="float-right" type="right" />
                    </div>
                  </List.Item>
                );
              }}
            />
          </StyledListWrapper>
        </StyledCard>
      )}
      {(currentCheckInIndex !== (checkInCards.allCheckIns.length - 1)) && (
        <StyledCard title="Next check-in">
          <StyledListWrapper>
            <List
              size="large"
              dataSource={[checkInCards.allCheckIns[currentCheckInIndex + 1]]}
              renderItem={({ name, scheduleId }) => {
                return (
                  <List.Item
                    key={scheduleId}
                    onClick={() => {
                      scrollToTop();
                      history.push({
                        pathname: `/checkins/${scheduleId}`,
                        state: {
                          checkin_id_alias: name,
                        },
                      });
                    }}
                  >
                    <div className="d-flex list-content-wrapper">
                      <Text>{name}</Text>
                      <Icon className="float-right" type="right" />
                    </div>
                  </List.Item>
                );
              }}
            />
          </StyledListWrapper>
        </StyledCard>
      )}
    </>    
  ) : null;
}

export default withRouter(CheckInNavigation);
