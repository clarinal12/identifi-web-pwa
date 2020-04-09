import { DataProxy } from 'apollo-cache/lib/types';
import cloneDeep from 'lodash/cloneDeep';

import { CHECKIN } from 'apollo/queries/checkin';
import { CHECKIN_RESPONSE_REACTORS } from 'apollo/queries/reactions';
import { IAccount } from 'apollo/types/user';
import { TEmoji, TCheckIn } from 'apollo/types/checkin';

interface ICacheHandler {
  checkInId?: string,
  responseId: string,
  values: {
    emoji: TEmoji,
    reactor?: IAccount,
  }
}

export default ({ checkInId, responseId, values }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { addCheckInResponseReaction } }: any) => {
    try {
      const checkInCacheData = store.readQuery<{ checkIn: TCheckIn }>({
        query: CHECKIN,
        variables: {
          id: checkInId,
          pagination: { first: 5 },
        },
      });
      if (checkInCacheData) {
        const clonedCheckInCacheData = cloneDeep(checkInCacheData);
        const { edges } = clonedCheckInCacheData.checkIn.replies;
        const checkInResponse = edges.find(({ node }) => node.id === responseId);  
        if (checkInResponse) {
          const reaction = checkInResponse.node.reactions.find((reactionGroup) => {
            return reactionGroup.emoji.id === values.emoji.id;
          });
          if (reaction) {
            reaction.count += 1;
            reaction.hasReacted = true;
          } else {
            checkInResponse.node.reactions.push({
              id: addCheckInResponseReaction.id,
              emoji: addCheckInResponseReaction,
              count: 1,
              hasReacted: true,
              __typename: "CheckInResponseReactionGroup",
            });
          }
          store.writeQuery({
            query: CHECKIN,
            variables: {
              id: checkInId,
              pagination: { first: 5 },
            },
            data: clonedCheckInCacheData,
          });
        }
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
