import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONES } from 'apollo/queries/oneOnOne';
import { IOneOnOnes, TOneOnOneInfo } from 'apollo/types/oneOnOnes';

interface ICacheHandler {
  directReportId: string,
  values: Partial<TOneOnOneInfo>,
}

export default ({ directReportId, values }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { scheduleOneOnOne } }: any) => {
    if (!scheduleOneOnOne) return;
    try {
      const oneOnOnesCacheData: { oneOnOnes: IOneOnOnes[] } | null = store.readQuery({
        query: ONE_ON_ONES,
      });
      const oneOnOneScheduleIndex = oneOnOnesCacheData?.oneOnOnes.findIndex(({ teammate }) => {
        return teammate.id === directReportId;
      }) || -1;
      if (oneOnOnesCacheData && oneOnOneScheduleIndex >= 0) {
        oneOnOnesCacheData.oneOnOnes[oneOnOneScheduleIndex].info = scheduleOneOnOne;
        store.writeQuery({
          query: ONE_ON_ONES,
          data: oneOnOnesCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    scheduleOneOnOne: {
      scheduleId: `optimistic-${Date.now()}-schedule-id`,
      currentSessionId: `optimistic-${Date.now()}-session-id`,
      ...values,
      __typename: "OneOnOneScheduleInfo",
    },
  }
});
