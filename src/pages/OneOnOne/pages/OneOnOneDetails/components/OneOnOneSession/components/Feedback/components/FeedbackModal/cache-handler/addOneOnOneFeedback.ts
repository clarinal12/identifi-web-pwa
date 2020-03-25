import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONE_SESSION, ONE_ON_ONE_HEADER } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession, IOneOnOneHeader } from 'apollo/types/oneOnOne';
import { IAccount } from 'apollo/types/user';
import { IFeedbackFormValues } from '../components/FeedbackForm/FeedbackForm';

interface ICacheHandler {
  sessionId: string,
  author: IAccount,
  values: IFeedbackFormValues,
}

export default ({
  sessionId, author, values,
}: ICacheHandler) => ({
  update: (store: DataProxy, { data: { addOneOnOneFeedback } }: any) => {
    try {
      const oneOnOneSessionCacheData: { oneOnOneSession: IOneOnOneSession } | null = store.readQuery({
        query: ONE_ON_ONE_SESSION,
        variables: { sessionId },
      });
      const feedbackIndex = oneOnOneSessionCacheData?.oneOnOneSession.feedbackInfo.findIndex((singleFeedback) => {
        return singleFeedback.author.id === author.id;
      });
      if (oneOnOneSessionCacheData && typeof feedbackIndex === 'number') {
        oneOnOneSessionCacheData.oneOnOneSession.feedbackInfo[feedbackIndex].feedback = addOneOnOneFeedback;
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
        oneOnOneHeaderCacheData.oneOnOneHeader.canCompleteSession = true;
        store.writeQuery({
          query: ONE_ON_ONE_HEADER,
          variables: { sessionId },
          data: oneOnOneHeaderCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    addOneOnOneFeedback: {
      id: `optimistic-${Date.now()}`,
      ...values,
      __typename: "OneOnOneFeedback",
    },
  }
});
