import { DataProxy } from 'apollo-cache/lib/types';

import { MEMBER } from 'apollo/queries/member';
import { AVAILABE_DIRECT_REPORTS } from 'apollo/queries/user';
import { IAccount } from 'apollo/types/graphql-types';
import { getDisplayName } from 'utils/userUtils';

interface ICacheHandler {
  managerId: string,
  directReport: IAccount,
}

export default ({ directReport, managerId }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { removeDirectReport } }: any) => {
    try {
      const directReportsCacheData: { availableDirectReports: IAccount[] } | null = store.readQuery({
        query: AVAILABE_DIRECT_REPORTS,
        variables: { managerId },
      });
      if (directReportsCacheData && removeDirectReport) {
        directReportsCacheData.availableDirectReports.push(directReport);
        directReportsCacheData.availableDirectReports.sort((a, b) => {
          const aDisplayName = getDisplayName(a);
          const bDisplayName = getDisplayName(b);
          return (aDisplayName && bDisplayName) ?
            aDisplayName.localeCompare(bDisplayName) :
            0;
        })
        store.writeQuery({
          query: AVAILABE_DIRECT_REPORTS,
          variables: { managerId },
          data: directReportsCacheData,
        });
      }
    } catch (_) {}
  
    try {
      const memberCacheData: { member: IAccount } | null = store.readQuery({
        query: MEMBER,
        variables: { memberId: managerId },
      });
      if (memberCacheData && removeDirectReport) {
        const newMember = { ...memberCacheData.member };
        newMember.directReports = memberCacheData.member.directReports.filter(dr => dr.id !== directReport.id);
        store.writeQuery({
          query: MEMBER,
          variables: { managerId },
          data: { member: newMember },
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    removeDirectReport: true,
  },
});
