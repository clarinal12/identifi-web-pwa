import React, { useState } from 'react';
import { List, Row, Col } from 'antd';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';

import { Spinner } from 'components/PageSpinner';
import LinkCard from './components/LinkCard';
import LinkFilters from './components/LinkFilters';
import { TFilterState } from './components/LinkFilters/LinkFilters';
import { STORED_LINKS } from 'apollo/queries/links';
import { IStoredLink } from 'apollo/types/link';
import { useUserContextValue } from 'contexts/UserContext';
import { elemT } from 'utils/typescriptUtils';

interface IPaginatedStoredLinks {
  storedLinks: {
    edges: Array<{
      cursor: string,
      node: IStoredLink,
    }>,
    pageInfo: {
      endCursor: string,
      hasNextPage: boolean,
    },
    totalCount: number,
  }
}

const StyledListItem = styled(List.Item)`
  &:last-of-type {
    margin-bottom: 0 !important;
  }
`;

const StyleSpinnerContainer = styled.div`
  .mini-spinner {
    min-height: 150px;
  }
`;

const LinkList = () => {
  const { account } = useUserContextValue();
  const companyId = account?.activeCompany?.id;
  const [filterState, setFilterState] = useState<TFilterState>({
    memberId: undefined,
    categoryId: undefined,
  });

  const { data, loading, fetchMore, networkStatus } = useQuery<IPaginatedStoredLinks>(STORED_LINKS, {
    variables: {
      companyId,
      filter: {
        categoryId: filterState.categoryId,
        memberId: filterState.memberId,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const fetchMoreLinks = (endCursor?: string) => {
    fetchMore({
      variables: {
        companyId,
        filter: {
          categoryId: filterState.categoryId,
          memberId: filterState.memberId,
        },
        ...(endCursor && {
          pagination: {
            after: endCursor,
          }
        }),
      },
      updateQuery: (previousResult: IPaginatedStoredLinks, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
        const prevEdges =  previousResult.storedLinks.edges;
        const newEdges = fetchMoreResult.storedLinks.edges;
        const newStoredLinksData = {
          ...previousResult.storedLinks,
          pageInfo: {
            endCursor: fetchMoreResult?.storedLinks.pageInfo.endCursor,
            hasNextPage: fetchMoreResult?.storedLinks.pageInfo.hasNextPage,
            __typename: "PageInfo",
          },
          edges: [...prevEdges, ...newEdges],
        };
        return { storedLinks: newStoredLinksData };
      },
    });
  };

  const derivedResult = data || {
    storedLinks: {
      edges: [],
      pageInfo: {
        endCursor: undefined,
        hasNextPage: false,
      },
      totalCount: 0,
    },
  };

  const dataSource = elemT(derivedResult.storedLinks.edges);

  return (
    <div>
      <LinkFilters
        filterState={filterState}
        setFilterState={setFilterState}
        companyId={companyId}
      />
      <Row>
        <Col>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            hasMore={!loading && derivedResult.storedLinks.pageInfo.hasNextPage}
            loadMore={() => fetchMoreLinks(derivedResult.storedLinks.pageInfo.endCursor)}
          >
            <List<IStoredLink>
              dataSource={dataSource.map(({ node }) => node)}
              renderItem={storedLink => (
                <StyledListItem className="border-bottom-0 p-0 mb-3" key={storedLink.id}>
                  <LinkCard storedLink={storedLink} />
                </StyledListItem>
              )}
            >
              {(networkStatus === 3 || (loading && networkStatus !== 3)) && (
                <StyleSpinnerContainer>
                  <Spinner label="" />
                </StyleSpinnerContainer>
              )}
            </List>
          </InfiniteScroll>
        </Col>
      </Row>
    </div>
  );
}

export default LinkList;
