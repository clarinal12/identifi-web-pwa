import { DataProxy } from 'apollo-cache/lib/types';

import { MEMBER } from 'apollo/queries/member';
import { ONE_ON_ONES } from 'apollo/queries/oneOnOne';
import { AVAILABE_DIRECT_REPORTS } from 'apollo/queries/user';
import { IAccount } from 'apollo/types/user';
import { IOneOnOnes } from 'apollo/types/oneOnOnes';

interface ICacheHandler {
  managerId: string,
  directReport: IAccount,
}

export default ({ managerId, directReport }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { addDirectReport } }: any) => {
    try {
      const directReportsCacheData: { availableDirectReports: IAccount[] } | null = store.readQuery({
        query: AVAILABE_DIRECT_REPORTS,
        variables: { managerId },
      });
      if (directReportsCacheData && addDirectReport) {
        const { availableDirectReports } = directReportsCacheData;
        store.writeQuery({
          query: AVAILABE_DIRECT_REPORTS,
          variables: { managerId },
          data: { availableDirectReports: availableDirectReports.filter(dr => dr.id !== addDirectReport.id) },
        });
      }
    } catch (_) {}

    try {
      const memberCacheData: { member: IAccount } | null = store.readQuery({
        query: MEMBER,
        variables: { memberId: managerId },
      });    
      if (memberCacheData && addDirectReport) {
        const newMember = { ...memberCacheData.member };
        newMember.directReports.push(addDirectReport);
        store.writeQuery({
          query: MEMBER,
          variables: { managerId },
          data: { member: newMember },
        });
      }  
    } catch (_) {}

    try {
      const oneOnOnesCacheData: { oneOnOnes: IOneOnOnes[] } | null = store.readQuery({
        query: ONE_ON_ONES,
      });    
      if (oneOnOnesCacheData && addDirectReport) {
        oneOnOnesCacheData.oneOnOnes.push({
          isManager: true,
          teammate: directReport,
          info: null,
          __typename: "OneOnOneCard",
        })
        store.writeQuery({
          query: ONE_ON_ONES,
          data: oneOnOnesCacheData,
        });
      }  
    } catch (_) {}
  },
  optimisticResponse: {
    addDirectReport: {
      ...directReport,
      id: `optimistic-response-${Date.now()}`,
    },
  },
});
