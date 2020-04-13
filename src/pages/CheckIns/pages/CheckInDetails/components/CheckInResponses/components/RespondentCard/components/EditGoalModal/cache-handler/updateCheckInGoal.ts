import { DataProxy } from 'apollo-cache/lib/types';

import { CHECKIN_RESPONSE_SECTION, CHECKIN_HEADER } from 'apollo/queries/checkin';
import { TCheckIn, TCheckInGoal, TCheckInHeader } from 'apollo/types/checkin';

interface ICacheHandler {
  isPreviousGoal?: boolean,
  respondentId?: string,
  scheduleId?: string,
  checkInId?: string,
  value: Partial<TCheckInGoal>,
}

export default ({ checkInId, scheduleId, respondentId, isPreviousGoal, value }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { updateCheckInGoal } }: any) => {
    try {
      const checkInCacheData = store.readQuery<{ checkInResponseSection: TCheckIn }>({
        query: CHECKIN_RESPONSE_SECTION,
        variables: {
          scheduleId,
          checkInId,
          pagination: { first: 5 },
        },
      });
      if (checkInCacheData && updateCheckInGoal) {
        const derivedGoalKey = isPreviousGoal ? 'previousGoal' : 'currentGoal';
        const respondentIndex = checkInCacheData.checkInResponseSection.replies.edges.findIndex(({ node }) => {
          return node.respondent.id === respondentId;
        });
        checkInCacheData.checkInResponseSection.replies.edges[respondentIndex].node[derivedGoalKey] = updateCheckInGoal;
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

    try {
      const checkInHeaderCacheData = store.readQuery<{ checkInHeader: TCheckInHeader }>({
        query: CHECKIN_HEADER,
        variables: { scheduleId, checkInId },
      });
      if (checkInHeaderCacheData && updateCheckInGoal) {
        const { stats } = checkInHeaderCacheData.checkInHeader;
        if (updateCheckInGoal.completed) {
          const selectedUserToBeMoved = stats.completedGoals.faded.find(({ id }) => id === respondentId);
          if (selectedUserToBeMoved) {
            const newFadedUsers = stats.completedGoals.faded.filter(({ id }) => id !== respondentId);
            stats.completedGoals.faded = newFadedUsers;
            stats.completedGoals.colored.push(selectedUserToBeMoved);
          }
        } else {
          const selectedUserToBeMoved = stats.completedGoals.colored.find(({ id }) => id === respondentId);
          if (selectedUserToBeMoved) {
            const newColoredUsers = stats.completedGoals.colored.filter(({ id }) => id !== respondentId);
            stats.completedGoals.colored = newColoredUsers;
            stats.completedGoals.faded.push(selectedUserToBeMoved);
          }
        }
        const totalMembers = stats.checkedIn.faded.length + stats.checkedIn.colored.length;
        stats.completedGoals.percentage = Math.round((stats.completedGoals.colored.length / totalMembers) * 100);
        store.writeQuery({
          query: CHECKIN_HEADER,
          variables: { scheduleId, checkInId },
          data: checkInHeaderCacheData,
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
