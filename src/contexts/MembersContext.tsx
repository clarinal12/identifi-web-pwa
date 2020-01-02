import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useQuery } from 'react-apollo';

import { useUserContextValue } from 'contexts/UserContext';
import { IAccount } from 'apollo/types/graphql-types';
import { MEMBERS } from 'apollo/queries/member';

interface IMembersContext {
  members: IAccount[],
}

const MembersContext = createContext<IMembersContext>({
  members: [],
});

const MembersProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;

  const { loading, data } = useQuery(MEMBERS, {
    variables: {
      companyId: activeCompany && activeCompany.id,
    },
  });

  return (
    <MembersContext.Provider
      value={{
        members: (!loading && data) ? [...data.members] : [],
      }}
    >
      {children}
    </MembersContext.Provider>
  );
}

const MembersConsumer = MembersContext.Consumer;

const useMembersContextValue = () => useContext(MembersContext);

export { MembersProvider, useMembersContextValue, MembersConsumer };

export default MembersConsumer;
