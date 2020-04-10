import { DataProxy } from 'apollo-cache/lib/types';
import { Location } from 'history/index';

import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN } from 'apollo/queries/checkin';
import { IComment, TCheckIn } from 'apollo/types/checkin';
import { IAccount } from 'apollo/types/user';

interface ICacheHandler {
  checkInId?: string,
  checkInResponseId: string,
  values: {
    comment: string,
    mentions: IAccount[],
    author: IAccount | undefined,
  },
  location: Location,
}

export default ({ checkInResponseId, values, checkInId, location }: ICacheHandler) => {
  const queryParams = new URLSearchParams(location.search);
  const memberIdFromLink = queryParams.get('memberId');
  const commentIdFromLink = queryParams.get('commentId');
  const isLinkFromNotification = (memberIdFromLink && commentIdFromLink);
  return {
    update: (store: DataProxy, { data: { addCheckInResponseComment } }: any) => {
      try {
        const checkInResponseCacheData = store.readQuery<{ checkInResponseComments: IComment[] }>({
          query: COMMENTS,
          variables: { checkInResponseId },
        });
        checkInResponseCacheData?.checkInResponseComments.push(addCheckInResponseComment);
        store.writeQuery({
          query: COMMENTS,
          variables: { checkInResponseId },
          data: checkInResponseCacheData,
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
            checkInResponse.node.numberOfComments += 1;
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
      addCheckInResponseComment: {
        id: `optimistic-${Date.now()}`,
        author: {
          id: values.author?.id,
          firstname: values.author?.firstname,
          lastname: values.author?.lastname,
          email: values.author?.email,
          avatar: values.author?.avatar,
          role: values.author?.role,
          isGuest: values.author?.isGuest,
          __typename: "Member"
        },
        mentions: values.mentions,
        comment: values.comment,
        createdAt: '',
        updatedAt: '',
        __typename: "CheckInResponseComment"
      }
    }
  };
};
