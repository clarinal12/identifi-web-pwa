import React from 'react';
import { useQuery } from 'react-apollo';
import cx from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Icon, Typography, Row, Col, List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { Spinner } from 'components/PageSpinner';
import { LoadingIcon } from 'components/PageSpinner';
import { scrollToTop } from 'utils/scrollUtils';
import { PastClockIcon } from 'utils/iconUtils';
import { getDisplayName } from 'utils/userUtils';
import { SESSION_STATUS_ICON } from 'utils/oneOnOneUtils';
import { StyledListWrapper } from 'utils/styledComponentUtils';
import { ONE_ON_ONE_SESSIONS } from 'apollo/queries/oneOnOne';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';
import { elemT } from 'utils/typescriptUtils';

const { Title, Text } = Typography;

type TEdge = {
  cursor: string,
  node: {
    id: string,
    time: string,
    status: 'UPCOMING' | 'HAPPENING' | 'INCOMPLETE' | 'COMPLETED' | 'SKIPPED',
    __typename: string,
  },
  __typename: string,
}

export interface IOneOnOneHistoryQuery {
  oneOnOneSessions: {
    edges: TEdge[],
    pageInfo: {
      endCursor: string,
      hasNextPage: boolean,
    },
    totalCount: number,
  }
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
        Once you had your first cycle of 1-on-1 with your teammate, all past 1-on-1s will appear here.
      </Text>
    </Col>
  </StyledEmptyRow>
);

const OneOnOneHistory: React.FC<RouteComponentProps<{ session_id: string }>> = ({ match, history }) => {
  const { selectedUserSession } = useOneOnOneContextValue();
  const directReport = selectedUserSession?.teammate;
  const scheduleId = selectedUserSession?.info?.scheduleId;
  const currentSessionStatus = selectedUserSession?.info?.currentSessionStatus || 'UPCOMING';
  const currentSessionId = selectedUserSession?.info?.currentSessionId;
  const upcomingSessionDate = selectedUserSession?.info?.upcomingSessionDate;

  const derivedSessionId = match.params.session_id || '';
  
  const { data, loading, fetchMore, networkStatus } = useQuery<IOneOnOneHistoryQuery>(ONE_ON_ONE_SESSIONS, {
    variables: { scheduleId },
    skip: !Boolean(scheduleId),
  });

  const fetchMoreSessions = async (endCursor?: string) => {
    fetchMore({
      variables: {
        scheduleId,
        ...(endCursor && {
          pagination: { after: endCursor },
        })
      },
      updateQuery: (previousResult: IOneOnOneHistoryQuery, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
        const prevEdges =  previousResult.oneOnOneSessions.edges;
        const newEdges = fetchMoreResult.oneOnOneSessions.edges;
        const newSessionHistoryData = {
          ...previousResult.oneOnOneSessions,
          pageInfo: {
            endCursor: fetchMoreResult?.oneOnOneSessions.pageInfo.endCursor,
            hasNextPage: fetchMoreResult?.oneOnOneSessions.pageInfo.hasNextPage,
          },
          edges: [...prevEdges, ...newEdges],
        };
        return { oneOnOneSessions: newSessionHistoryData };
      },
    });
  }

  if (loading) {
    return (
      <StyledSpinnerWrapper className="d-flex align-items-center justify-content-center">
        <Spin className="py-4" size="small" indicator={LoadingIcon} spinning tip="Fetching 1-on-1 history..." />
      </StyledSpinnerWrapper>
    );
  }

  const derivedResult = data || {
    oneOnOneSessions: {
      edges: [],
      pageInfo: {
        endCursor: undefined,
        hasNextPage: false,
      },
      totalCount: 0,
    },
  };

  const dataSource = elemT(derivedResult.oneOnOneSessions.edges);

  return (dataSource.length > 0) ? (
    <StyledListWrapper>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        hasMore={!loading && derivedResult.oneOnOneSessions.pageInfo.hasNextPage}
        loadMore={() => fetchMoreSessions(derivedResult.oneOnOneSessions.pageInfo.endCursor)}
      >
        <List
          dataSource={[{
            id: currentSessionId,
            status: currentSessionStatus,
            time: upcomingSessionDate,
          }].concat(dataSource.map(({ node }) => node))}
          renderItem={({ time, id, status }) => {
            const isActive = (id === derivedSessionId);
            return (
              <List.Item
                className={cx({ active: isActive })}
                key={id}
                onClick={() => {
                  scrollToTop();
                  history.push({
                    pathname: `/1-on-1s/${scheduleId}/${id || currentSessionId}`,
                    state: {
                      schedule_id_alias: getDisplayName(directReport),
                      session_id_alias: moment(time).format('MMM DD, YYYY'),
                      ignore_breadcrumb_link: ['schedule_id_alias'],
                    },
                  });
                }}
              >
                <div className="d-flex list-content-wrapper">
                  <Text
                    type={isActive ? undefined : 'secondary'}
                    strong={isActive}
                  >
                    {SESSION_STATUS_ICON[status]}
                    {moment(time).format('MMM DD, YYYY hh:mm A')}
                  </Text>
                  <Icon className="float-right" type="right" />
                </div>
              </List.Item>
            );
          }}
        >
          {(networkStatus === 3) && (
            <div>
              <Spinner label="" />
            </div>
          )}
        </List>
      </InfiniteScroll>
    </StyledListWrapper>
  ) : (
    <EmptyState />
  );
};

export default withRouter(OneOnOneHistory);
