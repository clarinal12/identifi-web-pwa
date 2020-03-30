import React, { createContext, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery } from 'react-apollo';

import { IOneOnOnes } from 'apollo/types/oneOnOne';
import { ONE_ON_ONES } from 'apollo/queries/oneOnOne';

interface IOneOnOneContext {
  oneOnOnes: IOneOnOnes[],
  loading: boolean,
  selectedUserSession?: IOneOnOnes,
}

const OneOnOneContext = createContext<IOneOnOneContext>({
  oneOnOnes: [],
  loading: true,
  selectedUserSession: undefined,
});

const OneOnOneProvider: React.FC<RouteComponentProps<{ schedule_id: string }>> = ({
  children, match
}) => {
  const { loading, data } = useQuery<IOneOnOneContext>(ONE_ON_ONES);
  const selectedUserSession = data?.oneOnOnes.find(({ info }) => info?.scheduleId === match.params.schedule_id);
  return (
    <OneOnOneContext.Provider
      value={{
        oneOnOnes: data?.oneOnOnes || [],
        loading,
        selectedUserSession
      }}
    >
      {children}
    </OneOnOneContext.Provider>
  );
}

const OneOnOneProviderWithRouter = withRouter(OneOnOneProvider);

const OneOnOneConsumer = OneOnOneContext.Consumer;

const useOneOnOneContextValue = () => useContext(OneOnOneContext);

export { OneOnOneProviderWithRouter, useOneOnOneContextValue, OneOnOneConsumer };

export default OneOnOneConsumer;
