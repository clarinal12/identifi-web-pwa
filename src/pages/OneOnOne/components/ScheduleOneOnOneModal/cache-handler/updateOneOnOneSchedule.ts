import moment from 'moment';
import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONES, ONE_ON_ONE_HEADER } from 'apollo/queries/oneOnOne';
import { IOneOnOnes, TOneOnOneInfo, IOneOnOneHeader } from 'apollo/types/oneOnOne';

interface ICacheHandler {
  directReportId: string,
  values: TOneOnOneInfo,
}

export default ({ directReportId, values }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { updateOneOnOneSchedule } }: any) => {
    if (!updateOneOnOneSchedule) return;
    try {
      const oneOnOnesCacheData: { oneOnOnes: IOneOnOnes[] } | null = store.readQuery({
        query: ONE_ON_ONES,
      });
      const oneOnOneScheduleIndex = oneOnOnesCacheData?.oneOnOnes.findIndex(({ teammate }) => {
        return teammate.id === directReportId;
      });
      if (oneOnOnesCacheData && typeof oneOnOneScheduleIndex === 'number') {
        oneOnOnesCacheData.oneOnOnes[oneOnOneScheduleIndex].info = updateOneOnOneSchedule;
        store.writeQuery({
          query: ONE_ON_ONES,
          data: oneOnOnesCacheData,
        });
      }
    } catch (_) {}

    try {
      const oneOnOneHeaderCacheData: { oneOnOneHeader: IOneOnOneHeader } | null = store.readQuery({
        query: ONE_ON_ONE_HEADER,
        variables: { sessionId: values.currentSessionId },
      });
      if (oneOnOneHeaderCacheData) {
        const multiplier = updateOneOnOneSchedule.frequency === 'BI_WEEKLY' ? 2 : 1;
        const daysToAdd = (multiplier * 7) - 1;
        const newMaxRescheduleDate = moment(updateOneOnOneSchedule.upcomingSessionDate).add(daysToAdd, 'days').utc(false).format();
        oneOnOneHeaderCacheData.oneOnOneHeader.time = updateOneOnOneSchedule.upcomingSessionDate;
        oneOnOneHeaderCacheData.oneOnOneHeader.maxRescheduleDateRange = newMaxRescheduleDate;        
        store.writeQuery({
          query: ONE_ON_ONE_HEADER,
          variables: { sessionId: values.currentSessionId },
          data: oneOnOneHeaderCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    updateOneOnOneSchedule: {
      ...values,
      __typename: "OneOnOneScheduleInfo",
    },
  }
});
