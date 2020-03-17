import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useQuery } from 'react-apollo';

import { IOneOnOnes } from 'apollo/types/oneOnOne';
import { ONE_ON_ONES } from 'apollo/queries/oneOnOne';

interface IOneOnOnesContext {
  oneOnOnes: IOneOnOnes[],
  loading: boolean,
}

const OneOnOnesContext = createContext<IOneOnOnesContext>({
  oneOnOnes: [],
  loading: true,
});

const OneOnOnesProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const { loading, data } = useQuery<IOneOnOnesContext>(ONE_ON_ONES);

  return (
    <OneOnOnesContext.Provider
      value={{
        oneOnOnes: data?.oneOnOnes || [],
        loading,
      }}
    >
      {children}
    </OneOnOnesContext.Provider>
  );
}

const OneOnOnesConsumer = OneOnOnesContext.Consumer;

const useOneOnOnesContextValue = () => useContext(OneOnOnesContext);

export { OneOnOnesProvider, useOneOnOnesContextValue, OneOnOnesConsumer };

export default OneOnOnesConsumer;
