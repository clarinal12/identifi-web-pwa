import { DataProxy } from 'apollo-cache/lib/types';

import { INTEGRATION_INFO } from 'apollo/queries/integration';
import {IGoogleIntegrationInfo } from '../Google';

interface ICacheHandler {
  scopes?: string[],
  scope: string,
}

export default ({ scopes, scope }: ICacheHandler) => {
  return {
    update: (store: DataProxy, { data: { setupGoogleIntegration } }: any) => {
      try {
        const integrationInfoCacheData = store.readQuery<{ integrationInfo: { google: IGoogleIntegrationInfo } }>({
          query: INTEGRATION_INFO,
        });
        if (integrationInfoCacheData) {
          integrationInfoCacheData.integrationInfo = setupGoogleIntegration;
          store.writeQuery({
            query: INTEGRATION_INFO,
            data: integrationInfoCacheData,
          });
        }
      } catch (_) {}
    },
    optimisticResponse: {
      setupGoogleIntegration: {
        google: {
          scopes,
          calendar: {
            enabled: true,
            scope,
            __typename: "GoogleServiceIntegrationInfo",
          },
          __typename: "GoogleIntegrationInfo",
        },
        __typename: "UserIntegrationInfo",
      }
    },
  };
};
