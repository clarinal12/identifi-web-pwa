import React, { createContext, useContext, useState, useEffect } from 'react';
import { IAccount } from 'apollo/types/user';

interface IUserContext {
  account: IAccount | undefined,
  token: string | null,
  setUserState?: (userState: IUserContext) => void,
}

interface IUserProvider {
  value: IUserContext,
}

const UserContext = createContext<IUserContext>({
  account: undefined,
  token: null,
});

const UserProvider: React.FC<IUserProvider> = ({ value, children }) => {
  const { account, token } = value;
  const [userState, setUserState] = useState<IUserContext>({
    account: undefined,
    token: null,
  });

  useEffect(() => {
    setUserState({
      account, token,
    });
  }, [account, token]);

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
