import { DataProxy } from 'apollo-cache/lib/types';

import { IOneOnOneHistoryQuery } from '../../OneOnOneHistory/OneOnOneHistory';
import { ONE_ON_ONE_SESSIONS } from 'apollo/queries/oneOnOne';
import { elemT } from 'utils/typescriptUtils';

interface ICacheHandler {
  scheduleId: string,
  sessionId?: string,
}

export default ({ scheduleId, sessionId }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { completeOneOnOne } }: any) => {
    try {
      const sessionsCacheData = store.readQuery<IOneOnOneHistoryQuery>({
        query: ONE_ON_ONE_SESSIONS,
        variables: { scheduleId },
      });
      if (sessionsCacheData && completeOneOnOne) {
        const newEdges = elemT(sessionsCacheData.oneOnOneSessions.edges).map((singleEdge) => {
          return {
            ...singleEdge,
            ...((singleEdge.node.id === sessionId) && {
              node: {
                ...singleEdge.node,
                status: 'COMPLETED',
              },
            }),
          };
        });
        store.writeQuery({
          query: ONE_ON_ONE_SESSIONS,
          variables: { scheduleId },
          data: {
            oneOnOneSessions: {
              ...sessionsCacheData.oneOnOneSessions,
              edges: newEdges,
            },
          },
        });
      }
    } catch(e) {}
  },
});
