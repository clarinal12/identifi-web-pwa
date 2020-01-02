import React, { createContext, useContext, PropsWithChildren } from 'react';
import { IAccount } from 'apollo/types/graphql-types';

interface IUserContext {
  account: IAccount | undefined,
  token: string | undefined,
  authenticated: boolean,
}

const UserContext = createContext<IUserContext>({
  account: undefined,
  token: undefined,
  authenticated: false,
});

const UserProvider: React.FC<PropsWithChildren<{ value: any }>> = ({ value, children }) => {
  const { account, token, authenticated } = value;
  return (
    <UserContext.Provider value={{ account, token, authenticated }}>
      {children}
    </UserContext.Provider>
  );
}

const UserConsumer = UserContext.Consumer;

const useUserContextValue = () => useContext(UserContext);

export { UserProvider, useUserContextValue, UserConsumer };

export default UserContext;
