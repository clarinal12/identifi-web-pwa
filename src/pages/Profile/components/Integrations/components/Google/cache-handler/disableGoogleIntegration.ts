import { DataProxy } from 'apollo-cache/lib/types';

import { INTEGRATION_INFO } from 'apollo/queries/integration';
import {IGoogleIntegrationInfo } from '../Google';

interface ICacheHandler {
  scopes?: string[],
  scope: string,
}

export default ({ scopes, scope }: ICacheHandler) => {
  return {
    update: (store: DataProxy, { data: { disableGoogleIntegration } }: any) => {
      try {
        const integrationInfoCacheData = store.readQuery<{ integrationInfo: { google: IGoogleIntegrationInfo } }>({
          query: INTEGRATION_INFO,
        });
        if (integrationInfoCacheData) {
          integrationInfoCacheData.integrationInfo = disableGoogleIntegration;
          store.writeQuery({
            query: INTEGRATION_INFO,
            data: integrationInfoCacheData,
          });
        }
      } catch (_) {}
    },
    optimisticResponse: {
      disableGoogleIntegration: {
        google: {
          scopes,
          calendar: {
            enabled: false,
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
