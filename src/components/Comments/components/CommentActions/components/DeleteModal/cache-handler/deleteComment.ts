import { DataProxy } from 'apollo-cache/lib/types';
import { Location } from 'history/index';

import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN } from 'apollo/queries/checkin';
import { IComment, TCheckIn } from 'apollo/types/checkin';

interface ICacheHandler {
  commentId: string,
  checkInId?: string,
  checkInResponseId: string,
  location: Location,
}

export default ({ commentId, checkInResponseId, checkInId, location }: ICacheHandler) => {
  const queryParams = new URLSearchParams(location.search);
  const memberIdFromLink = queryParams.get('memberId');
  const commentIdFromLink = queryParams.get('commentId');
  const isLinkFromNotification = (memberIdFromLink && commentIdFromLink);
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
        const checkInCacheData = store.readQuery<{ checkIn: TCheckIn }>({
          query: CHECKIN,
          variables: {
            id: checkInId,
            pagination: { first: 5 },
            ...(isLinkFromNotification && {
              filter: { memberId: memberIdFromLink },
            }),
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
                ...(isLinkFromNotification && {
                  filter: { memberId: memberIdFromLink },
                }),
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
