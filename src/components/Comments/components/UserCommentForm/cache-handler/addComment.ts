import { DataProxy } from 'apollo-cache/lib/types';

import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN_RESPONSE_SECTION } from 'apollo/queries/checkin';
import { IComment, TCheckIn } from 'apollo/types/checkin';
import { IAccount } from 'apollo/types/user';
import { TResponseFilterState } from 'contexts/CheckInResponseFilterContext';

interface ICacheHandler {
  scheduleId?: string,
  checkInId?: string,
  checkInResponseId: string,
  values: {
    comment: string,
    mentions: IAccount[],
    author: IAccount | undefined,
  },
  filter: TResponseFilterState,
}

export default ({ checkInResponseId, values, checkInId, scheduleId, filter }: ICacheHandler) => {
  return {
    update: (store: DataProxy, { data: { addCheckInResponseComment } }: any) => {
      try {
        const checkInResponseCacheData = store.readQuery<{ checkInResponseComments: IComment[] }>({
          query: COMMENTS,
          variables: { checkInResponseId },
        });
        if (!checkInResponseCacheData?.checkInResponseComments.find(({ id }) => id === addCheckInResponseComment.id)) {
          checkInResponseCacheData?.checkInResponseComments.push(addCheckInResponseComment);
        }
        store.writeQuery({
          query: COMMENTS,
          variables: { checkInResponseId },
          data: checkInResponseCacheData,
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
            checkInResponse.node.numberOfComments += 1;
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
