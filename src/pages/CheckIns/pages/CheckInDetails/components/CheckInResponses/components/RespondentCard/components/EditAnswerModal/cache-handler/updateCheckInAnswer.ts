import { DataProxy } from 'apollo-cache/lib/types';

import { CHECKIN_RESPONSE_SECTION } from 'apollo/queries/checkin';
import { TCheckIn, TCheckInAnswer } from 'apollo/types/checkin';

interface ICacheHandler {
  respondentId?: string,
  scheduleId?: string,
  checkInId?: string,
  value: Partial<TCheckInAnswer>,
}

export default ({ checkInId, scheduleId, respondentId, value }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { updateCheckInAnswer } }: any) => {
    try {
      const checkInCacheData = store.readQuery<{ checkInResponseSection: TCheckIn }>({
        query: CHECKIN_RESPONSE_SECTION,
        variables: {
          scheduleId,
          checkInId,
          pagination: { first: 5 },
        },
      });
      if (checkInCacheData && updateCheckInAnswer) {
        const { edges } = checkInCacheData.checkInResponseSection.replies;
        const respondentIndex = edges.findIndex(({ node }) => {
          return node.respondent.id === respondentId;
        });
        const answerIndex = edges[respondentIndex].node.answers.findIndex(({ id }) => id === value.id);
        edges[respondentIndex].node.answers[answerIndex] = updateCheckInAnswer;
        store.writeQuery({
          query: CHECKIN_RESPONSE_SECTION,
          variables: {
            scheduleId,
            checkInId,
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
