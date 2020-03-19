import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONES, ONE_ON_ONE_SCHEDULE } from 'apollo/queries/oneOnOne';
import { IOneOnOnes, TOneOnOneInfo, IOneOnOneSchedule } from 'apollo/types/oneOnOne';

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
      const { scheduleId, ...otherValues } = values;
      const oneOnOneScheduleCacheData: { oneOnOneSchedule: IOneOnOneSchedule } | null = store.readQuery({
        query: ONE_ON_ONE_SCHEDULE,
        variables: { scheduleId }
      });
      if (oneOnOneScheduleCacheData) {
        oneOnOneScheduleCacheData.oneOnOneSchedule = {
          ...oneOnOneScheduleCacheData.oneOnOneSchedule,
          ...otherValues,
        };
        store.writeQuery({
          query: ONE_ON_ONE_SCHEDULE,
          variables: { scheduleId },
          data: oneOnOneScheduleCacheData,
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
