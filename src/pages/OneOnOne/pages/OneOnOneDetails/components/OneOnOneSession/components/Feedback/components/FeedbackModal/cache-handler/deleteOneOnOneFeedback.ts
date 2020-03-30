import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONE_SESSION, ONE_ON_ONE_HEADER } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession, IOneOnOneHeader } from 'apollo/types/oneOnOne';
import { IAccount } from 'apollo/types/user';

interface ICacheHandler {
  author: IAccount,
  sessionId: string,
}

export default ({ sessionId, author }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { deleteOneOnOneFeedback } }: any) => {
    if (!deleteOneOnOneFeedback) return;
    try {
      const oneOnOneSessionCacheData: { oneOnOneSession: IOneOnOneSession } | null = store.readQuery({
        query: ONE_ON_ONE_SESSION,
        variables: { sessionId },
      });
      const feedbackIndex = oneOnOneSessionCacheData?.oneOnOneSession.feedbackInfo.findIndex((singleFeedback) => {
        return singleFeedback.author.id === author.id;
      });
      if (oneOnOneSessionCacheData && typeof feedbackIndex === 'number') {
        oneOnOneSessionCacheData.oneOnOneSession.feedbackInfo[feedbackIndex].feedback = null;
        store.writeQuery({
          query: ONE_ON_ONE_SESSION,
          variables: { sessionId },
          data: oneOnOneSessionCacheData,
        });
      }
    } catch (_) {}

    try {
      const oneOnOneHeaderCacheData: { oneOnOneHeader: IOneOnOneHeader } | null = store.readQuery({
        query: ONE_ON_ONE_HEADER,
        variables: { sessionId },
      });
      if (oneOnOneHeaderCacheData) {
        oneOnOneHeaderCacheData.oneOnOneHeader.canCompleteSession = false;
        store.writeQuery({
          query: ONE_ON_ONE_HEADER,
          variables: { sessionId },
          data: oneOnOneHeaderCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    deleteOneOnOneFeedback: true,
  }
});
