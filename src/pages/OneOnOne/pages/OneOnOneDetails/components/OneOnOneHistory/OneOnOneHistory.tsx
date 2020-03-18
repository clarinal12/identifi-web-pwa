import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import cx from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Icon, Typography, Row, Col, List, Spin } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';
import { scrollToTop } from 'utils/scrollUtils';
import { PastClockIcon } from 'utils/iconUtils';
import { getDisplayName } from 'utils/userUtils';
import { StyledListWrapper } from 'utils/styledComponentUtils';
import { ONE_ON_ONE_SESSIONS } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession } from 'apollo/types/oneOnOne';
import { IAccount } from 'apollo/types/user';

const { Title, Text } = Typography;

interface IOneOnOneHistory extends RouteComponentProps<{ direct_report_id: string }> {
  upcomingSessionDate?: string,
  directReport?: IAccount,
  scheduleId?: string,
  pastOneOnOneId: string,
  setPastOneOnOneId: (id: string) => void,
}

interface IOneOnOneHistoryQuery {
  oneOnOneSessions: {
    edges: Array<{
      cursor: string,
      node: IOneOnOneSession,
    }>,
    pageInfo: {
      endCursor: string,
      hasNextPage: boolean,
    },
    totalCount: number,
  }
}

interface IOneOnOneSessionState {
  dataSource: IOneOnOneSession[],
  hasMore: boolean,
  loading: boolean,
  endCursor?: string,
}

const StyledEmptyRow = styled(Row)`
  min-height: 250px;
  justify-content: center;
  align-items: center;
`;

const StyledSpinnerWrapper = styled.div`
  .ant-spin-text {
    margin-top: 24px;
  }
`;

const EmptyState = () => (
  <StyledEmptyRow className="d-flex px-3">
    <Col className="text-center">
      <PastClockIcon />
      <Title className="mt-4 fs-16">No past 1-on-1s yet</Title>
      <Text type="secondary">
        Once you had your first cycle of 1-on-1 with your manager, all past 1-on-1s will appear here.
      </Text>
    </Col>
  </StyledEmptyRow>
);

const OneOnOneHistory: React.FC<IOneOnOneHistory> = ({
  match, history, location, setPastOneOnOneId,
  pastOneOnOneId, scheduleId, upcomingSessionDate, directReport,
}) => {
  const [state, setState] = useState<IOneOnOneSessionState>({
    dataSource: [],
    loading: true,
    hasMore: true,
    endCursor: undefined,
  });

  const { data, loading } = useQuery<IOneOnOneHistoryQuery>(ONE_ON_ONE_SESSIONS, {
    variables: { scheduleId },
    notifyOnNetworkStatusChange: true,
    skip: !Boolean(scheduleId),
  });

  useEffect(() => {
    if (!loading && data && !state.endCursor) {
      const { oneOnOneSessions } = data;
      setState({
        dataSource: [...state.dataSource].concat(oneOnOneSessions.edges.map(({ node }) => node)),
        loading: false,
        hasMore: oneOnOneSessions.pageInfo.hasNextPage,
        endCursor: oneOnOneSessions.pageInfo.endCursor,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  if ((loading || !Boolean(scheduleId)) && !data) {
    return (
      <StyledSpinnerWrapper className="d-flex align-items-center justify-content-center">
        <Spin className="py-4" size="small" indicator={LoadingIcon} spinning tip="Fetching 1-on-1 history..." />
      </StyledSpinnerWrapper>
    );
  }

  return (state.dataSource.length > 0) ? (
    <StyledListWrapper>
      <List
        size="large"
        dataSource={[{ time: '', id: '' }].concat(state.dataSource)}
        renderItem={({ time, id }) => {
          const isActive = (id === pastOneOnOneId);
          const isPastCheckIn = (time && id);
          const dateString = isPastCheckIn ?
            moment(time).format('MMM DD, YYYY hh:mm A') : moment(upcomingSessionDate).calendar();
          return (
            <List.Item
              className={cx({ active: isActive })}
              key={id}
              onClick={() => {
                scrollToTop();
                setPastOneOnOneId(id);
                if (isPastCheckIn) {
                  history.push({
                    pathname: `/1-on-1s/${match.params.direct_report_id}/${id}`,
                    state: {
                      ...location.state,
                      past_session_id_alias: moment(time).format('MMM DD, YYYY'),
                    },
                  });
                } else {
                  history.push({
                    pathname: `/1-on-1s/${match.params.direct_report_id}`,
                    state: {
                      direct_report_id_alias: getDisplayName(directReport),
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

export default withRouter(OneOnOneHistory);
