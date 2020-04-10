import { DataProxy } from 'apollo-cache/lib/types';
import { Location } from 'history/index';
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
  },
  location: Location,
}

export default ({ checkInId, responseId, values, location }: ICacheHandler) => {
  const queryParams = new URLSearchParams(location.search);
  const memberIdFromLink = queryParams.get('memberId');
  const commentIdFromLink = queryParams.get('commentId');
  const isLinkFromNotification = (memberIdFromLink && commentIdFromLink);
  return {
    update: (store: DataProxy, { data: { removeCheckInResponseReaction } }: any) => {
      if (!removeCheckInResponseReaction) return;
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
          const clonedCheckInCacheData = cloneDeep(checkInCacheData);
          const { edges } = clonedCheckInCacheData.checkIn.replies;
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
            query: CHECKIN,
            variables: {
              id: checkInId,
              pagination: { first: 5 },
              ...(isLinkFromNotification && {
                filter: { memberId: memberIdFromLink },
              }),
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
