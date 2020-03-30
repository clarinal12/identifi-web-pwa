import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession } from 'apollo/types/oneOnOne';
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
  update: (store: DataProxy, { data: { updateOneOnOneFeedback } }: any) => {
    try {
      const oneOnOneSessionCacheData: { oneOnOneSession: IOneOnOneSession } | null = store.readQuery({
        query: ONE_ON_ONE_SESSION,
        variables: { sessionId },
      });
      const feedbackIndex = oneOnOneSessionCacheData?.oneOnOneSession.feedbackInfo.findIndex((singleFeedback) => {
        return singleFeedback.author.id === author.id;
      });
      if (oneOnOneSessionCacheData && typeof feedbackIndex === 'number') {
        oneOnOneSessionCacheData.oneOnOneSession.feedbackInfo[feedbackIndex].feedback = updateOneOnOneFeedback;
        store.writeQuery({
          query: ONE_ON_ONE_SESSION,
          variables: { sessionId },
          data: oneOnOneSessionCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    updateOneOnOneFeedback: {
      id: `optimistic-${Date.now()}`,
      ...values,
      __typename: "OneOnOneFeedback",
    },
  }
});
