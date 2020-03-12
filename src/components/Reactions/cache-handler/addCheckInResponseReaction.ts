import { DataProxy } from 'apollo-cache/lib/types';

import { CHECKIN, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { CHECKIN_RESPONSE_REACTORS } from 'apollo/queries/reactions';
import { IAccount } from 'apollo/types/user';
import { TEmoji, TCurrentCheckIn } from 'apollo/types/checkin';

interface ICacheHandler {
  isPastCheckIn: boolean,
  checkInId: string,
  responseId: string,
  values: {
    emoji: TEmoji,
    reactor?: IAccount,
  }
}

export default ({
  isPastCheckIn, checkInId, responseId, values,
}: ICacheHandler) => ({
  update: (store: DataProxy, { data: { addCheckInResponseReaction } }: any) => {
    try {
      const checkInCacheData: any | null = store.readQuery({
        query: isPastCheckIn ? CHECKIN : CHECKIN_SCHEDULE,
        variables: { id: checkInId },
      });
      const checkInSource: TCurrentCheckIn = isPastCheckIn ? checkInCacheData?.checkIn : checkInCacheData?.checkInSchedule.currentCheckIn;
      const checkInResponse = checkInSource.responses.find(({ id }) => id === responseId);
      if (checkInResponse) {
        const reactionIndex = checkInResponse.reactions.findIndex((reactionGroup) => {
          return reactionGroup.emoji.id === values.emoji.id;
        });
        if (reactionIndex >= 0) {
          checkInResponse.reactions[reactionIndex].count += 1;
          checkInResponse.reactions[reactionIndex].hasReacted = true;
        } else {
          checkInResponse.reactions.push({
            emoji: addCheckInResponseReaction,
            count: 1,
            hasReacted: true,
            __typename: "CheckInResponseReactionGroup",
          });
        }
        store.writeQuery({
          query: isPastCheckIn ? CHECKIN : CHECKIN_SCHEDULE,
          variables: { id: checkInId },
          data: checkInCacheData,
        });
      }
    } catch (_) {}

    try {
      const reactorsCacheData: any | null = store.readQuery({
        query: CHECKIN_RESPONSE_REACTORS,
        variables: {
          filter: { responseId, emojiId: values.emoji.id },
        },
      });
      reactorsCacheData.checkInResponseReactors.push({
        id: values.reactor?.id,
        email: values.reactor?.email,
        firstname: values.reactor?.firstname,
        lastname: values.reactor?.lastname,
        role: values.reactor?.role,
        avatar: values.reactor?.avatar,
        isGuest: values.reactor?.isGuest,
        __typename: 'Member',
      });
      store.writeQuery({
        query: CHECKIN_RESPONSE_REACTORS,
        variables: {
          filter: { responseId, emojiId: values.emoji.id },
        },
        data: reactorsCacheData,
      });
    } catch (_) {}
  },
  optimisticResponse: {
    addCheckInResponseReaction: {
      ...values.emoji,
      id: `optimistic-${values.emoji.id}`,
    }
  },
});
