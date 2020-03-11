import { DataProxy } from 'apollo-cache/lib/types';

import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN_SCHEDULE, CHECKIN } from 'apollo/queries/checkin';
import { IComment, TCurrentCheckIn } from 'apollo/types/checkin';

interface ICacheHandler {
  commentId: string,
  isPastCheckIn: boolean,
  checkInId: string,
  checkInResponseId: string,
}

export default ({
  commentId, checkInResponseId, isPastCheckIn, checkInId,
}: ICacheHandler) => ({
  update: (store: DataProxy, { data: { deleteCheckInResponseComment } }: any) => {
    if (!deleteCheckInResponseComment) return;
    try {
      const checkInResponseCacheData: { checkInResponseComments: IComment[] } | null = store.readQuery({
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
      const DERIVED_QUERY = isPastCheckIn ? CHECKIN : CHECKIN_SCHEDULE;
      const checkInCacheData: any | null = store.readQuery({
        query: DERIVED_QUERY,
        variables: { id: checkInId },
      });
      const checkInSource: TCurrentCheckIn = isPastCheckIn ? checkInCacheData?.checkIn : checkInCacheData?.checkInSchedule.currentCheckIn;
      const checkInResponse = checkInSource.responses.find(({ id }) => id === checkInResponseId) || { numberOfComments: 0 };
      checkInResponse.numberOfComments -= 1;
      store.writeQuery({
        query: DERIVED_QUERY,
        variables: { id: checkInId },
        data: checkInCacheData,
      });
    } catch (_) {}
  },
  optimisticResponse: {
    deleteCheckInResponseComment: true,
  }
});
