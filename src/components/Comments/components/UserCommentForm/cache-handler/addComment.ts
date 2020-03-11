import { DataProxy } from 'apollo-cache/lib/types';

import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN_SCHEDULE, CHECKIN } from 'apollo/queries/checkin';
import { IComment, TCurrentCheckIn } from 'apollo/types/checkin';
import { IAccount } from 'apollo/types/user';

interface ICacheHandler {
  isPastCheckIn: boolean,
  checkInId: string,
  checkInResponseId: string,
  values: {
    comment: string,
    mentions: IAccount[],
    author: IAccount | undefined,
  },
}

export default ({
  checkInResponseId, values, isPastCheckIn, checkInId,
}: ICacheHandler) => ({
  update: (store: DataProxy, { data: { addCheckInResponseComment } }: any) => {
    try {
      const checkInResponseCacheData: { checkInResponseComments: IComment[] } | null = store.readQuery({
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
      const DERIVED_QUERY = isPastCheckIn ? CHECKIN : CHECKIN_SCHEDULE;
      const checkInCacheData: any | null = store.readQuery({
        query: DERIVED_QUERY,
        variables: { id: checkInId },
      });
      const checkInSource: TCurrentCheckIn = isPastCheckIn ? checkInCacheData?.checkIn : checkInCacheData?.checkInSchedule.currentCheckIn;
      const checkInResponse = checkInSource.responses.find(({ id }) => id === checkInResponseId) || { numberOfComments: 0 };
      checkInResponse.numberOfComments += 1;
      store.writeQuery({
        query: DERIVED_QUERY,
        variables: { id: checkInId },
        data: checkInCacheData,
      });
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
