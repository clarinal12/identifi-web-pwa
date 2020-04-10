import { DataProxy } from 'apollo-cache/lib/types';

import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN } from 'apollo/queries/checkin';
import { IComment, TCheckIn } from 'apollo/types/checkin';

interface ICacheHandler {
  commentId: string,
  checkInId?: string,
  checkInResponseId: string,
}

export default ({ commentId, checkInResponseId, checkInId }: ICacheHandler) => ({
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
      const checkInCacheData = store.readQuery<{ checkIn: TCheckIn }>({
        query: CHECKIN,
        variables: {
          id: checkInId,
          pagination: { first: 5 },
        },
      });
      if (checkInCacheData) {
        const { edges } = checkInCacheData.checkIn.replies;
        const checkInResponse = edges.find(({ node }) => node.id === checkInResponseId);
        if (checkInResponse) {
          checkInResponse.node.numberOfComments -= 1;
          store.writeQuery({
            query: CHECKIN,
            variables: {
              id: checkInId,
              pagination: { first: 5 },
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
});
