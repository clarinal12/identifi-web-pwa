import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { RouteComponentProps, Link } from 'react-router-dom';
import { isLoggedIn, getAuthToken } from 'utils/userUtils';
import { ACCOUNT } from 'apollo/queries/user';
import { IAccount } from 'apollo/types/graphql-types';

import { UserProvider } from 'contexts/UserContext';
import PageSpinner from 'components/PageSpinner';

const redirectToRootPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/account/password/reset',
  '/invite/setup'
];

interface IQueryVariables {
  token: string
}

interface IQueryData {
  me: IAccount
}

export default <P extends object>(
  ComposedComponent: React.ComponentType<P>,
  requireAuth = true,
) => {
  const RequireAuth: React.FC<P & RouteComponentProps> = (props) => {
    let newProps = { ...props, requireAuth };
    const token = getAuthToken();
    const skipAuth = !isLoggedIn();

    useEffect(() => {
      const redirectToHome = () => {
        if (isLoggedIn()) {
          const { history } = props;
          const { pathname } = window.location;
          if (redirectToRootPaths.includes(pathname)) {
            history.replace('/');
          }
        }
      }
      const redirectToLogin = () => {
        if (!isLoggedIn()) {
          const { history } = props;
          history.replace('/login');
        }
      }
      requireAuth ? redirectToLogin() : redirectToHome();
    }, [props]);

    const { data, loading, error } = useQuery<IQueryData, IQueryVariables>(ACCOUNT, {
      variables: { token },
      skip: skipAuth,
    });

    if (error) {
      localStorage.clear();
      return <>
        {/* <p>Error component here</p> */}
        <pre>{error.graphQLErrors[0].message}</pre>
        <Link to="/login">Go to login page</Link>
      </>;
    }

    if (data) {
      newProps = {
        ...props,
        requireAuth, account: data.me, token,
        authenticated: !!(data.me && token),
      };
    }

    return (
      <UserProvider value={newProps}>
        <PageSpinner loading={loading}>
          {!loading && <ComposedComponent {...newProps as P} />}
        </PageSpinner>
      </UserProvider>
    );
  }
  return RequireAuth;
};
