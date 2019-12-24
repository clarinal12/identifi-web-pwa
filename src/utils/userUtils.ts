import { IAccount } from 'apollo/types/graphql-types';

export const setAuthToken = (token: string): void => localStorage.setItem('auth_token', token);

export const getAuthToken = (): string => localStorage.getItem('auth_token') || '';

export const isLoggedIn = (): boolean => getAuthToken().length > 0;

export const getDisplayName = (account: Partial<IAccount> | undefined) => {
  const nameString = account && account.firstname && account.lastname ?
  `${account.firstname} ${account.lastname}` : (account || { email: undefined }).email;
  return nameString;
}
