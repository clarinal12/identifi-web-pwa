import { DataProxy } from 'apollo-cache/lib/types';

import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN_RESPONSE_SECTION } from 'apollo/queries/checkin';
import { IComment, TCheckIn } from 'apollo/types/checkin';
import { TResponseFilterState } from 'contexts/CheckInResponseFilterContext';

interface ICacheHandler {
  commentId: string,
  scheduleId?: string,
  checkInId?: string,
  checkInResponseId: string,
  filter: TResponseFilterState,
}

export default ({ commentId, checkInResponseId, checkInId, scheduleId, filter }: ICacheHandler) => {
  return {
    update: (store: DataProxy, { data: { deleteCheckInResponseComment } }: any) => {
      if (!deleteCheckInResponseComment) return;
      try {
        const checkInResponseCacheData = store.readQuery<{ checkInResponseComments: IComment[] }>({
          query: COMMENTS,
          variables: { checkInResponseId },
        });
        const newSetOfComments = checkInResponseCacheData?.checkInResponseComments.filter((comment) => {
          return comment.id !== commentId;
        });
        store.writeQuery({
          query: COMMENTS,
          variables: { checkInResponseId },
          data: { checkInResponseComments: newSetOfComments },
        });
      } catch (_) {}
  
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
          const { edges } = checkInCacheData.checkInResponseSection.replies;
          const checkInResponse = edges.find(({ node }) => node.id === checkInResponseId);
          if (checkInResponse) {
            checkInResponse.node.numberOfComments -= 1;
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
        }
      } catch (_) {}
    },
    optimisticResponse: {
      deleteCheckInResponseComment: true,
    }
  };
};
