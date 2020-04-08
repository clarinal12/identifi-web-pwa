import React from 'react';
import { useQuery } from 'react-apollo';
import cx from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Icon, Typography, Row, Col, List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { LoadingIcon } from 'components/PageSpinner';
import { PAST_CHECKINS } from 'apollo/queries/checkin';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import { scrollToTop } from 'utils/scrollUtils';
import { PastClockIcon } from 'utils/iconUtils';
import { StyledListWrapper } from 'utils/styledComponentUtils';
import { elemT } from 'utils/typescriptUtils';

const { Title, Text } = Typography;

type TEdge = {
  cursor: string,
  node: {
    id: string,
    date: string,
    __typename: string,
  },
  __typename: string,
}

interface ICheckInHistoryQuery {
  pastCheckIns: {
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
      <Title className="mt-4 fs-16">No past check-ins yet</Title>
      <Text type="secondary">
        Once you go through your first cycle for this check-in, all past check-ins will appear here.
      </Text>
    </Col>
  </StyledEmptyRow>
);

const PastCheckInList: React.FC<RouteComponentProps<{ checkin_id: string, past_checkin_id: string }>> = ({
  match, history, location,
}) => {
  const { selectedCheckInCard } = useCheckInScheduleContextValue();

  const { data, loading, fetchMore, networkStatus } = useQuery<ICheckInHistoryQuery>(PAST_CHECKINS, {
    variables: { checkInScheduleId: match.params.checkin_id },
    skip: !Boolean(match.params.checkin_id),
    notifyOnNetworkStatusChange: true,
  });

  const fetchMoreCheckins = (endCursor?: string) => {
    fetchMore({
      variables: {
        checkInScheduleId: match.params.checkin_id,
        ...(endCursor && {
          pagination: { after: endCursor },
        })
      },
      updateQuery: (previousResult: ICheckInHistoryQuery, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
        const prevEdges =  previousResult.pastCheckIns.edges;
        const newEdges = fetchMoreResult.pastCheckIns.edges;
        const newCheckInHistoryData = {
          ...previousResult.pastCheckIns,
          pageInfo: {
            endCursor: fetchMoreResult?.pastCheckIns.pageInfo.endCursor,
            hasNextPage: fetchMoreResult?.pastCheckIns.pageInfo.hasNextPage,
            __typename: "PageInfo",
          },
          edges: [...prevEdges, ...newEdges],
        };
        return { pastCheckIns: newCheckInHistoryData };
      },
    });
  }

  if (loading && networkStatus === 1) {
    return (
      <StyledSpinnerWrapper className="d-flex align-items-center justify-content-center">
        <Spin className="py-4" size="small" indicator={LoadingIcon} spinning tip="Fetching check-in history..." />
      </StyledSpinnerWrapper>
    );
  }

  const derivedResult = data || {
    pastCheckIns: {
      edges: [],
      pageInfo: {
        endCursor: undefined,
        hasNextPage: false,
      },
      totalCount: 0,
    },
  };

  const derivedPastCheckinId = match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;
  const dataSource = elemT(derivedResult.pastCheckIns.edges);

  return (dataSource.length > 0) ? (
    <StyledListWrapper>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        hasMore={!loading && derivedResult.pastCheckIns.pageInfo.hasNextPage}
        loadMore={() => fetchMoreCheckins(derivedResult.pastCheckIns.pageInfo.endCursor)}
        useWindow={false}
      >
        <List
          size="large"
          dataSource={[{
            id: selectedCheckInCard?.currentCheckInInfo?.id,
            date: selectedCheckInCard?.currentCheckInInfo?.date,
          }].concat(dataSource.map(({ node }) => node))}
          renderItem={({ date, id }) => {
            const isActive = (id === derivedPastCheckinId);
            const isPastCheckIn = (date && id);
            return (
              <List.Item
                className={cx({ active: isActive })}
                key={id}
                onClick={() => {
                  scrollToTop();
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
                        checkin_id_alias: 'name',
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
                    {moment(date).format('MMM DD, YYYY hh:mm A')}
                  </Text>
                  <Icon className="float-right" type="right" />
                </div>
              </List.Item>
            );
          }}
        >
          {(networkStatus === 3 || (loading && networkStatus !== 3)) && (
            <StyledSpinnerWrapper className="d-flex align-items-center justify-content-center">
              <Spin className="py-3" size="small" indicator={LoadingIcon} spinning />
            </StyledSpinnerWrapper>
          )}
        </List>
      </InfiniteScroll>
    </StyledListWrapper>
  ) : (
    <EmptyState />
  );
};

export default withRouter(PastCheckInList);
