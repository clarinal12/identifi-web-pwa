import React, { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
import { IAccount } from 'apollo/types/graphql-types';

interface IUserContext {
  account: IAccount | undefined,
  token: string | undefined,
  authenticated: boolean,
  setUserState?: (userState: IUserContext) => void,
}

const UserContext = createContext<IUserContext>({
  account: undefined,
  token: undefined,
  authenticated: false,
});

const UserProvider: React.FC<PropsWithChildren<{ value: any }>> = ({ value, children }) => {
  const { account, token, authenticated } = value;
  const [userState, setUserState] = useState<IUserContext>({
    account, token, authenticated,
  });

  useEffect(() => {
    setUserState({
      ...userState,
      account,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <UserContext.Provider value={{ ...userState, setUserState }}>
      {children}
    </UserContext.Provider>
  );
}

const UserConsumer = UserContext.Consumer;

const useUserContextValue = () => useContext(UserContext);

export { UserProvider, useUserContextValue, UserConsumer };

export default UserContext;
