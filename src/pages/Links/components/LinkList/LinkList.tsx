import React from 'react';
import { useQuery } from 'react-apollo';

import { Spinner } from 'components/PageSpinner';
import LinkCard from './components/LinkCard';
import { STORED_LINKS } from 'apollo/queries/links';
import { IStoredLink } from 'apollo/types/graphql-types';
import { useUserContextValue } from 'contexts/UserContext';

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

const LinkList = () => {
  const { account } = useUserContextValue();
  const companyId = account && account.activeCompany.id;
  const { data, loading } = useQuery<IPaginatedStoredLinks>(STORED_LINKS, {
    variables: {
      companyId,
    },
  });
  const dataSource = (!loading && data) ? data.storedLinks.edges.map(({ node }) => node) : [];
  return loading ? (
    <Spinner />
  ) : (
    <div>
      {dataSource.map((storedLink) => (
        <LinkCard key={storedLink.id} storedLink={storedLink} />
      ))}
    </div>
  );
}

export default LinkList;
