import { DataProxy } from 'apollo-cache/lib/types';

import { IOneOnOneHistoryQuery } from '../../OneOnOneHistory/OneOnOneHistory';
import { ONE_ON_ONE_SESSIONS, ONE_ON_ONE_HEADER, ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { elemT } from 'utils/typescriptUtils';
import { IOneOnOneHeader, IOneOnOneSession } from 'apollo/types/oneOnOne';

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
      if (sessionsCacheData && completeOneOnOne && sessionId) {
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

    try {
      const oneOnOneHeaderCacheData = store.readQuery<{ oneOnOneHeader: IOneOnOneHeader }>({
        query: ONE_ON_ONE_HEADER,
        variables: { sessionId },
      });
      if (oneOnOneHeaderCacheData && completeOneOnOne) {
        oneOnOneHeaderCacheData.oneOnOneHeader = {
          ...oneOnOneHeaderCacheData.oneOnOneHeader,
          status: 'COMPLETED',
          canRescheduleSession: false,
          canSkipSession: false,
          showCompleteButton: false,
          canCompleteSession: false,
        };
        store.writeQuery({
          query: ONE_ON_ONE_HEADER,
          variables: { sessionId },
          data: oneOnOneHeaderCacheData,
        });
      }
    } catch(e) {}

    try {
      const oneOnOneSessionCacheData = store.readQuery<{ oneOnOneSession: IOneOnOneSession }>({
        query: ONE_ON_ONE_SESSION,
        variables: { sessionId },
      });
      if (oneOnOneSessionCacheData && completeOneOnOne) {
        oneOnOneSessionCacheData.oneOnOneSession = {
          ...oneOnOneSessionCacheData.oneOnOneSession,
          status: 'COMPLETED',
          canModifyAgenda: false,
          canModifyFeedback: false,
        };
        store.writeQuery({
          query: ONE_ON_ONE_SESSION,
          variables: { sessionId },
          data: oneOnOneSessionCacheData,
        });
      }
    } catch(e) {}
  },
  optimisticResponse: {
    completeOneOnOne: true,
  },
});
