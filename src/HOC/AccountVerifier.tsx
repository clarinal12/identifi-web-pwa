import React from 'react';
import { Redirect } from 'react-router-dom';
import { useUserContextValue } from 'contexts/UserContext';

const setupPath = '/setup';

export default <P extends object>(
  ComposedComponent: React.ComponentType<P>,
  blockAuthenticatedUser: boolean = false,
) => {
  const AccountVerifier: React.FC<P> = (props) => {
    const { account, token } = useUserContextValue();
    const { pathname } = window.location;
    if (account && token) {
      const { onboarded } = account;
      if ((!onboarded) && pathname !== setupPath) {
        return <Redirect to={setupPath} />;
      }
      if (blockAuthenticatedUser && onboarded) {
        return <Redirect to="/" />;
      }
    }
    return (
      <ComposedComponent {...props as P} />
    );
  }
  return AccountVerifier;
};
