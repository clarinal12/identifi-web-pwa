import { ApolloClient } from 'apollo-client';
import { InMemoryCache,IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
// import { onError } from 'apollo-link-error';
import { ApolloLink, Observable, Operation } from 'apollo-link';
import { ZenObservable } from 'zen-observable-ts';

import introspectionQueryResultData from '../fragment-types.json'
import { getAuthToken, isLoggedIn } from 'utils/userUtils';
import env from 'config/env';

const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });
const cache = new InMemoryCache({ fragmentMatcher });

const request = async (operation: Operation) => {
  operation.setContext({
    ...(isLoggedIn() && {
      headers: {
        authorization: `Bearer ${getAuthToken()}`,
      }
    }),
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle: ZenObservable.Subscription;
    Promise.resolve(operation)
      .then(oper => request(oper))
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
    // onError(({ graphQLErrors, networkError }) => {
    //   if (graphQLErrors) console.log(graphQLErrors);
    //   if (networkError) console.log(networkError);
    // }),
    requestLink,
    new HttpLink({
      uri: process.env[`REACT_APP_${env}_API_URL`],
      credentials: 'same-origin',
    }),
  ]),
  cache,
});

export default client;
