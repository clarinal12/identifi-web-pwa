import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';

import { Spinner } from 'components/PageSpinner';
import LinkCard from './components/LinkCard';
import { STORED_LINKS } from 'apollo/queries/links';
import { IStoredLink } from 'apollo/types/graphql-types';
import { useUserContextValue } from 'contexts/UserContext';
import { useMessageContextValue } from 'contexts/MessageContext';

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

interface ILinkListState {
  dataSource: IStoredLink[],
  hasMore: boolean,
  loading: boolean,
  endCursor?: string,
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
  const { alertSuccess } = useMessageContextValue();
  const { account } = useUserContextValue();
  const companyId = account && account.activeCompany.id;
  const [state, setState] = useState<ILinkListState>({
    dataSource: [],
    loading: true,
    hasMore: true,
    endCursor: undefined,
  });

  const { data, loading, refetch } = useQuery<IPaginatedStoredLinks>(STORED_LINKS, {
    variables: {
      companyId,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      const { storedLinks } = data;
      setState({
        dataSource: [...state.dataSource].concat(storedLinks.edges.map(({ node }) => node)),
        loading: false,
        hasMore: storedLinks.pageInfo.hasNextPage,
        endCursor: storedLinks.pageInfo.endCursor,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  useEffect(() => {
    if (!state.hasMore) {
      alertSuccess('All links are loaded');
    }
  }, [state.hasMore, alertSuccess]);
  
  const refetchLinks = async () => {
    setState({ ...state, loading: true });
    const { data: refetchResult } = await refetch({
      companyId,
      ...(state.endCursor && {
        filter: {
          after: state.endCursor,
        },
      }),
    });
    setState({
      ...state,
      loading: false,
      hasMore: refetchResult.storedLinks.pageInfo.hasNextPage,
      endCursor: refetchResult.storedLinks.pageInfo.endCursor,
      dataSource: [...state.dataSource].concat(refetchResult.storedLinks.edges.map(({ node }) => node)),
    });
  }

  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      hasMore={!state.loading && state.hasMore}
      loadMore={refetchLinks}
    >
      <List
        dataSource={state.dataSource}
        renderItem={storedLink => (
          <StyledListItem className="border-bottom-0 p-0 mb-3" key={storedLink.id}>
            <LinkCard storedLink={storedLink} />
          </StyledListItem>
        )}
      >
        {state.loading && (
          <StyleSpinnerContainer>
            <Spinner label="" />
          </StyleSpinnerContainer>
        )}
      </List>
    </InfiniteScroll>
  );
}

export default LinkList;
