import { DataProxy } from 'apollo-cache/lib/types';

import { COMMENTS } from 'apollo/queries/comments';
import { IComment } from 'apollo/types/checkin';
import { IAccount } from 'apollo/types/user';

interface ICacheHandler {
  commentId: string | undefined,
  checkInResponseId: string,
  values: {
    comment: string,
    mentions: IAccount[],
    author: IAccount | undefined,
  },
}

export default ({ values, checkInResponseId, commentId }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { updateCheckInResponseComment } }: any) => {
    try {
      const checkInResponseCacheData: { checkInResponseComments: IComment[] } | null = store.readQuery({
        query: COMMENTS,
        variables: { checkInResponseId },
      });
      const newSetOfComments = checkInResponseCacheData?.checkInResponseComments.map((comment) => {
        return comment.id === commentId
          ? {
            ...comment,
            id: updateCheckInResponseComment.id,
            comment: updateCheckInResponseComment.comment,
            mentions: updateCheckInResponseComment.mentions,
          } : comment
      });
      store.writeQuery({
        query: COMMENTS,
        variables: { checkInResponseId },
        data: { checkInResponseComments: newSetOfComments },
      });
    } catch (_) {}
  },
  optimisticResponse: {
    updateCheckInResponseComment: {
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
});
