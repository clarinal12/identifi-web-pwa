import React, { useEffect } from "react";
import { useQuery } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { isLoggedIn, getAuthToken } from "utils/userUtils";
import { ACCOUNT } from "apollo/queries/user";
import { IAccount } from "apollo/types/user";

import { UserProvider } from "contexts/UserContext";
import PageSpinner from "components/PageSpinner";
import ErrorPage from "pages/ErrorPage";

const redirectToRootPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/account/password/reset",
  "/invite/setup",
];

interface IQueryVariables {
  token: string;
}

interface IQueryData {
  me: IAccount;
}

export default <P extends object>(
  ComposedComponent: React.ComponentType<P>,
  requireAuth = true
) => {
  const RequireAuth: React.FC<P & RouteComponentProps> = (props) => {
    const token = getAuthToken();

    const { data, loading, error } = useQuery<IQueryData, IQueryVariables>(
      ACCOUNT,
      {
        variables: { token },
        skip: !isLoggedIn(),
        fetchPolicy: "cache-and-network",
        onCompleted: (response) => console.log("completed", response),
      }
    );

    useEffect(() => {
      const redirectToHome = () => {
        console.log("CHECK REDIRECT HOME");
        if (isLoggedIn()) {
          console.log("REDIRECT HOME");
          const { history } = props;
          const { pathname } = window.location;
          if (redirectToRootPaths.includes(pathname)) {
            history.replace("/");
          }
        }
      };
      const redirectToLogin = () => {
        console.log("CHECK REDIRECT LOGIN");
        if (!isLoggedIn()) {
          console.log("REDIRECT LOGIN");
          const { history } = props;
          history.replace("/login");
        }
      };
      requireAuth ? redirectToLogin() : redirectToHome();
    }, [props]);

    console.log({ error, token, data, isLoggedIn: isLoggedIn() });

    // if (error) {
    //   localStorage.clear();
    //   return <ErrorPage errorMessage={error.graphQLErrors[0].message} />;
    // }

    return loading ? (
      <PageSpinner />
    ) : (
      <UserProvider value={{ token, account: data?.me }}>
        <ComposedComponent {...(props as P)} />
      </UserProvider>
    );
  };
  return RequireAuth;
};
