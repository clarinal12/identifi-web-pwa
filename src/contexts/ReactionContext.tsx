import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useQuery } from 'react-apollo';

import { EMOJIS } from 'apollo/queries/reactions';
import { TEmoji } from 'apollo/types/checkin';

interface IReactionContext {
  reactionEmojis: TEmoji[],
  loading: boolean,
}

const ReactionContext = createContext<IReactionContext>({
  reactionEmojis: [],
  loading: true,
});

const ReactionProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const { data, loading } = useQuery<{ emojis: TEmoji[] }>(EMOJIS);


  return (
    <ReactionContext.Provider
      value={{
        reactionEmojis: data?.emojis || [],
        loading,
      }}
    >
      {children}
    </ReactionContext.Provider>
  );
}

const ReactionConsumer = ReactionContext.Consumer;

const useReactionContextValue = () => useContext(ReactionContext);

export { ReactionProvider, useReactionContextValue, ReactionConsumer };

export default ReactionContext;
