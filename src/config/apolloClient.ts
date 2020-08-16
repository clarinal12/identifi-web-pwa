import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, Operation } from "apollo-link";
import { ZenObservable } from "zen-observable-ts";
import { CachePersistor } from "apollo-cache-persist";

import introspectionQueryResultData from "../fragment-types.json";
import { getAuthToken, isLoggedIn } from "utils/userUtils";
import env from "config/env";

const SCHEMA_VERSION = "1";
const SCHEMA_VERSION_KEY = "apollo-schema-version";

const getApolloClient = async () => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  const cache = new InMemoryCache({ fragmentMatcher });

  const persistor = new CachePersistor({
    cache,
    storage: window.localStorage as any,
  });

  const currentVersion = window.localStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    await persistor.restore();
  } else {
    await persistor.purge();
    window.localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }

  const request = async (operation: Operation) => {
    operation.setContext({
      ...(isLoggedIn() && {
        headers: {
          authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: ZenObservable.Subscription;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) console.log(graphQLErrors);
        if (networkError) console.log(networkError);
      }),
      requestLink,
      new HttpLink({
        uri: process.env[`REACT_APP_${env}_API_URL`],
        credentials: "same-origin",
      }),
    ]),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "cache-and-network",
      },
    },
  });

  return client;
};

export default getApolloClient;
