import ApolloClient, {
  IntrospectionFragmentMatcher, InMemoryCache,
} from 'apollo-boost';

import introspectionQueryResultData from '../../fragment-types.json'
import { getAuthToken, isLoggedIn } from 'utils/userUtils';
import env from 'config/env';

const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });

export default new ApolloClient({
  uri: process.env[`REACT_APP_${env}_API_URL`],
  cache: new InMemoryCache({ fragmentMatcher }),
  request: async operation => {
    operation.setContext({
      ...(isLoggedIn() && {
        headers: {
          authorization: `Bearer ${getAuthToken()}`,
        }
      })
    });
  },
});
