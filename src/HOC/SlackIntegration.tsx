import React from 'react';

import AppLayout from 'components/AppLayout';
import ConnectSlack from 'components/ConnectSlack';
import { useUserContextValue } from 'contexts/UserContext';

export default <P extends object>(
  ComposedComponent: React.ComponentType<P>,
  slackMessage: string,
) => {
  const SlackIntegration: React.FC<P> = (props) => {
    const { account } = useUserContextValue();
    const activeCompany = account?.activeCompany;
    if (!(activeCompany?.slackEnabled)) {
      return (
        <AppLayout>
          <ConnectSlack slackMessage={slackMessage} />
        </AppLayout>
      );
    }
    return (
      <ComposedComponent {...props as P} />
    );
  }
  return SlackIntegration;
};
