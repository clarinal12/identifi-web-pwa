export const setAuthToken = (token: string): void => localStorage.setItem('auth_token', token);

export const getAuthToken = (): string => localStorage.getItem('auth_token') || '';

export const isLoggedIn = (): boolean => getAuthToken().length > 0;
