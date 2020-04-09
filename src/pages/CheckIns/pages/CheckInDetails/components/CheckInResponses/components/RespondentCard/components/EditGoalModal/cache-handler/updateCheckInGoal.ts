import { DataProxy } from 'apollo-cache/lib/types';

import { CHECKIN } from 'apollo/queries/checkin';
import { TCheckIn, TCheckInGoal } from 'apollo/types/checkin';

interface ICacheHandler {
  isPreviousGoal?: boolean,
  respondentId?: string,
  checkInId?: string,
  value: Partial<TCheckInGoal>,
}

export default ({ checkInId, respondentId, isPreviousGoal, value }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { updateCheckInGoal } }: any) => {
    try {
      const checkInCacheData = store.readQuery<{ checkIn: TCheckIn }>({
        query: CHECKIN,
        variables: {
          id: checkInId,
          pagination: { first: 5 },
        },
      });
      if (checkInCacheData && updateCheckInGoal) {
        const derivedGoalKey = isPreviousGoal ? 'previousGoal' : 'currentGoal';
        const respondentIndex = checkInCacheData.checkIn.replies.edges.findIndex(({ node }) => {
          return node.respondent.id === respondentId;
        });
        checkInCacheData.checkIn.replies.edges[respondentIndex].node[derivedGoalKey] = updateCheckInGoal;
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
    updateCheckInGoal: {
      ...value,
      id: `optimistic-${value.id}`
    },
  },
});
