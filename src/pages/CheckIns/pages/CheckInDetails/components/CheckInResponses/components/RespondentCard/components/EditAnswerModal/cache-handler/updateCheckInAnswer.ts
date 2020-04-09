import { DataProxy } from 'apollo-cache/lib/types';

import { CHECKIN } from 'apollo/queries/checkin';
import { TCheckIn, TCheckInAnswer } from 'apollo/types/checkin';

interface ICacheHandler {
  respondentId?: string,
  checkInId?: string,
  value: Partial<TCheckInAnswer>,
}

export default ({ checkInId, respondentId, value }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { updateCheckInAnswer } }: any) => {
    try {
      const checkInCacheData = store.readQuery<{ checkIn: TCheckIn }>({
        query: CHECKIN,
        variables: {
          id: checkInId,
          pagination: { first: 5 },
        },
      });
      if (checkInCacheData && updateCheckInAnswer) {
        const { edges } = checkInCacheData.checkIn.replies;
        const respondentIndex = edges.findIndex(({ node }) => {
          return node.respondent.id === respondentId;
        });
        const answerIndex = edges[respondentIndex].node.answers.findIndex(({ id }) => id === value.id);
        edges[respondentIndex].node.answers[answerIndex] = updateCheckInAnswer;
        store.writeQuery({
          query: CHECKIN,
          variables: {
            id: checkInId,
            pagination: { first: 5 },
          },
          data: checkInCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    updateCheckInAnswer: {
      ...value,
      id: `optimistic-${value.id}`,
      __typename: "CheckInAnswer",
    },
  },
});
