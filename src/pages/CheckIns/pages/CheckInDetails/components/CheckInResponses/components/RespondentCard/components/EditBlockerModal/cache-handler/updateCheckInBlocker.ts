import { DataProxy } from 'apollo-cache/lib/types';

import { CHECKIN, CHECKIN_HEADER } from 'apollo/queries/checkin';
import { TCheckIn, TBlocker, TCheckInHeader } from 'apollo/types/checkin';

interface ICacheHandler {
  isBlocked?: boolean,
  respondentId?: string,
  checkInId?: string,
  value: Partial<TBlocker>,
}

export default ({ checkInId, respondentId, isBlocked, value }: ICacheHandler) => {
  const derivedMutation = isBlocked ? 'updateCheckInBlocker' : 'removeCheckInBlocker';
  return {
    update: (store: DataProxy, { data }: any) => {
      const result = data[derivedMutation];
      try {
        const checkInCacheData = store.readQuery<{ checkIn: TCheckIn }>({
          query: CHECKIN,
          variables: {
            id: checkInId,
            pagination: { first: 5 },
          },
        });
        if (checkInCacheData) {
          const respondentIndex = checkInCacheData.checkIn.replies.edges.findIndex(({ node }) => {
            return node.respondent.id === respondentId;
          });
          checkInCacheData.checkIn.replies.edges[respondentIndex].node.block = isBlocked ? result : null;
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
  
      try {
        const checkInHeaderCacheData = store.readQuery<{ checkInHeader: TCheckInHeader }>({
          query: CHECKIN_HEADER,
          variables: { checkInId },
        });
        if (checkInHeaderCacheData) {
          const { stats } = checkInHeaderCacheData.checkInHeader;
          if (!isBlocked) {
            const newColoredUsers = stats.blockers.colored.filter(({ id }) => id !== respondentId);
            stats.blockers.colored = newColoredUsers;
          }
          const totalMembers = stats.checkedIn.faded.length + stats.checkedIn.colored.length;
          stats.blockers.percentage = Math.round((stats.blockers.colored.length / totalMembers) * 100);
          store.writeQuery({
            query: CHECKIN_HEADER,
            variables: { checkInId },
            data: checkInHeaderCacheData,
          });
        }
      } catch (_) {}
    },
    optimisticResponse: {
      [derivedMutation]: isBlocked ? {
        ...value,
        id: `optimistic-${value.id}`,
        __typename: "CheckInBlocker"
      } : true,
    },
  };
};
