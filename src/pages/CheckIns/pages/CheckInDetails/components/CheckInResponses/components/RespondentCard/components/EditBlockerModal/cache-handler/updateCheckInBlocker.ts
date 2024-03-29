import { DataProxy } from 'apollo-cache/lib/types';

import { CHECKIN_RESPONSE_SECTION, CHECKIN_HEADER } from 'apollo/queries/checkin';
import { TCheckIn, TBlocker, TCheckInHeader } from 'apollo/types/checkin';
import { TResponseFilterState } from 'contexts/CheckInResponseFilterContext';

interface ICacheHandler {
  isBlocked?: boolean,
  respondentId?: string,
  scheduleId?: string,
  checkInId?: string,
  filter: TResponseFilterState,
  value: Partial<TBlocker>,
}

export default ({ checkInId, scheduleId, respondentId, isBlocked, value, filter }: ICacheHandler) => {
  const derivedMutation = isBlocked ? 'updateCheckInBlocker' : 'removeCheckInBlocker';
  return {
    update: (store: DataProxy, { data }: any) => {
      const result = data[derivedMutation];
      try {
        const checkInCacheData = store.readQuery<{ checkInResponseSection: TCheckIn }>({
          query: CHECKIN_RESPONSE_SECTION,
          variables: {
            scheduleId,
            checkInId,
            pagination: { first: 5 },
            filter,
          },
        });
        if (checkInCacheData) {
          const respondentIndex = checkInCacheData.checkInResponseSection.replies.edges.findIndex(({ node }) => {
            return node.respondent.id === respondentId;
          });
          checkInCacheData.checkInResponseSection.replies.edges[respondentIndex].node.block = isBlocked ? result : null;
          store.writeQuery({
            query: CHECKIN_RESPONSE_SECTION,
            variables: {
              scheduleId,
              checkInId,
              pagination: { first: 5 },
              filter,
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
        if (checkInHeaderCacheData && checkInHeaderCacheData.checkInHeader.stats) {
          const { stats } = checkInHeaderCacheData.checkInHeader;
          if (!isBlocked) {
            const newColoredUsers = stats.blockers.colored.filter(({ id }) => id !== respondentId);
            stats.blockers.colored = newColoredUsers;
          }
          const totalMembers = stats.checkedIn.faded.length + stats.checkedIn.colored.length;
          stats.blockers.percentage = Math.round((stats.blockers.colored.length / totalMembers) * 100);
          store.writeQuery({
            query: CHECKIN_HEADER,
            variables: { scheduleId, checkInId },
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
