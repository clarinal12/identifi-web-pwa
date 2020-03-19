import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession } from 'apollo/types/oneOnOne';
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
  },
  optimisticResponse: {
    deleteOneOnOneFeedback: true,
  }
});
