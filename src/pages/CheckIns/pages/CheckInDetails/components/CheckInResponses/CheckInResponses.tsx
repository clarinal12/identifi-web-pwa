import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { Spin, Row, Col, Typography, Alert } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { LoadingIcon } from 'components/PageSpinner';
import RespondentCard from './components/RespondentCard';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import { useCheckInResponseFilterContextValue } from 'contexts/CheckInResponseFilterContext';
import { CHECKIN_RESPONSE_SECTION } from 'apollo/queries/checkin';
import { TCheckIn } from 'apollo/types/checkin';
import { IconMessage } from 'utils/iconUtils';
import { elemT } from 'utils/typescriptUtils';

const { Title, Text } = Typography;

interface ICheckInResponseQuery {
  checkInResponseSection: TCheckIn
}

const StyledSpinnerWrapper = styled.div`
  .ant-spin-text {
    margin-top: 24px;
  }
`;

const StyledEmptyRow = styled(Row)`
  min-height: 350px;
  justify-content: center;
  align-items: center;
`;

const EmptyState = ({ done = false }: { done?: boolean }) => (
  <StyledEmptyRow className="d-flex">
    <Col sm={6} md={24} className="text-center">
      <IconMessage />
      <Title className="mt-4" level={2}>No replies {done ? '' : 'yet'}</Title>
      {!done && <Text>Once replies start coming in they’ll appear here.</Text>}
    </Col>
  </StyledEmptyRow>
);

const CheckInResponses: React.FC<RouteComponentProps<{ past_checkin_id: string, checkin_id: string }>>  = ({ match }) => {
  const { selectedCheckInCard } = useCheckInScheduleContextValue();
  const { responseFilterState } = useCheckInResponseFilterContextValue();
  const derivedPastCheckInId = match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;

  const { data, loading, fetchMore, networkStatus, error } = useQuery<ICheckInResponseQuery>(CHECKIN_RESPONSE_SECTION, {
    variables: {
      scheduleId: selectedCheckInCard?.scheduleId,
      checkInId: derivedPastCheckInId,
      pagination: { first: 5 },
      filter: responseFilterState,
    },
    notifyOnNetworkStatusChange: true,
    skip: !Boolean(selectedCheckInCard?.scheduleId),
  });

  const fetchMoreResponses = (endCursor?: string) => {
    fetchMore({
      variables: {
        id: derivedPastCheckInId,
        ...(endCursor && {
          pagination: {
            first: 5,
            after: endCursor,
          },
        }),
      },
      updateQuery: (previousResult: ICheckInResponseQuery, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
        const prevEdges =  previousResult.checkInResponseSection.replies.edges;
        const newEdges = fetchMoreResult.checkInResponseSection.replies.edges;
        const newCheckInData = {
          ...previousResult.checkInResponseSection,
          replies: {
            ...previousResult.checkInResponseSection.replies,
            edges: [...prevEdges, ...newEdges],
            pageInfo: {
              endCursor: fetchMoreResult?.checkInResponseSection.replies.pageInfo.endCursor,
              hasNextPage: fetchMoreResult?.checkInResponseSection.replies.pageInfo.hasNextPage,
              __typename: "PageInfo",
            },
          }
        };
        return { checkInResponseSection: newCheckInData };
      },
    });
  }

  if (error) {
    return (
      <Alert
        showIcon
        type="warning"
        message={function() {
          let errorMessage = "Network error";
          if (error.graphQLErrors[0]) {
            errorMessage = error.graphQLErrors[0].message;
          }
          return errorMessage;
        }()}
        description="There was an error fetching check-in responses."
      />
    );
  }

  if (loading && [1,2].includes(networkStatus)) {
    return (
      <StyledSpinnerWrapper className="py-4 d-flex align-items-center justify-content-center">
        <Spin size="small" indicator={LoadingIcon} spinning tip="Loading check-in responses..." />
      </StyledSpinnerWrapper>
    );
  }
  
  const derivedResult = data || {
    checkInResponseSection: {
      id: '',
      isCurrent: false,
      replies: {
        edges: [],
        pageInfo: {
          endCursor: undefined,
          hasNextPage: false,
        },
        totalCount: 0,
      }
    },
  };

  const replies = derivedResult.checkInResponseSection.replies;
  const dataSource = elemT(replies.edges).map(({ node }) => node);

  return data ? (
    (dataSource.length > 0) ? (
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        hasMore={!loading && replies.pageInfo.hasNextPage}
        loadMore={() => fetchMoreResponses(replies.pageInfo.endCursor)}
        threshold={750}
      >
        {dataSource.map((response) => (
          <RespondentCard key={`response_${response.id}`} response={response} isCurrent={derivedResult.checkInResponseSection.isCurrent} />
        ))}
        {(networkStatus === 3 || (loading && networkStatus !== 3)) && (
          <StyledSpinnerWrapper className="d-flex align-items-center justify-content-center">
            <Spin className="py-5" size="small" indicator={LoadingIcon} spinning />
          </StyledSpinnerWrapper>
        )}
      </InfiniteScroll>
    ) : <EmptyState />
  ) : null;
};

export default withRouter(CheckInResponses);
