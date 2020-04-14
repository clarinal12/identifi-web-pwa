import { DataProxy } from 'apollo-cache/lib/types';
import cloneDeep from 'lodash/cloneDeep';

import { CHECKIN_RESPONSE_SECTION } from 'apollo/queries/checkin';
import { CHECKIN_RESPONSE_REACTORS } from 'apollo/queries/reactions';
import { IAccount } from 'apollo/types/user';
import { TEmoji, TCheckIn } from 'apollo/types/checkin';
import { TResponseFilterState } from 'contexts/CheckInResponseFilterContext';

interface ICacheHandler {
  scheduleId?: string,
  checkInId?: string,
  responseId: string,
  values: {
    emoji: TEmoji,
    reactor?: IAccount,
  },
  filter: TResponseFilterState,
}

export default ({ checkInId, scheduleId, responseId, values, filter }: ICacheHandler) => {
  return {
    update: (store: DataProxy, { data: { removeCheckInResponseReaction } }: any) => {
      if (!removeCheckInResponseReaction) return;
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
          const clonedCheckInCacheData = cloneDeep(checkInCacheData);
          const { edges } = clonedCheckInCacheData.checkInResponseSection.replies;
          const checkInResponse = edges.find(({ node }) => node.id === responseId);  
          const reaction = checkInResponse?.node.reactions.find((reactionGroup) => {
            return reactionGroup.emoji.id === values.emoji.id;
          });
          if (checkInResponse && reaction) {
            reaction.count -= 1;
            reaction.hasReacted = false;
            checkInResponse.node.reactions = checkInResponse.node.reactions
              .filter(({ count }) => count > 0);
          }
          store.writeQuery({
            query: CHECKIN_RESPONSE_SECTION,
            variables: {
              scheduleId,
              checkInId,
              pagination: { first: 5 },
              filter,
            },
            data: clonedCheckInCacheData,
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
        store.writeQuery({
          query: CHECKIN_RESPONSE_REACTORS,
          variables: {
            filter: { responseId, emojiId: values.emoji.id },
          },
          data: {
            checkInResponseReactors: reactorsCacheData.checkInResponseReactors
              .filter((reactor: IAccount) => {
                return reactor.id !== values.reactor?.id;
              }),
          },
        });
      } catch (_) {}
    },
    optimisticResponse: {
      removeCheckInResponseReaction: true
    },
  };
};
