import { DataProxy } from 'apollo-cache/lib/types';

import { CHECKIN, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
// import { CHECKIN_RESPONSE_REACTORS, EMOJIS } from 'apollo/queries/reactions';
// import { IAccount } from 'apollo/types/graphql-types';

interface ICacheHandler {
  isPastCheckIn: boolean,
  checkInId: string,
  responseId: string,
  emojiId: number,
}

export default ({
  isPastCheckIn, checkInId, responseId, emojiId,
}: ICacheHandler) => ({
  update: (store: DataProxy, { data }: any) => {
    try {
      const checkInCacheData: any | null = store.readQuery({
        query: isPastCheckIn ? CHECKIN : CHECKIN_SCHEDULE,
        variables: { id: checkInId },
      });
      console.log(data);
      console.log(checkInCacheData)
    } catch (_) {}
  },
});
