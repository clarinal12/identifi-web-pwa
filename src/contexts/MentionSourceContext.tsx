import React, { createContext, useContext, PropsWithChildren, useState } from 'react';
import { IAccount } from 'apollo/types/user';

interface IMentionSourceContext {
  mentionSource: IAccount[],
  setMentionSource: (source: IAccount[]) => void
}

const MentionSourceContext = createContext<IMentionSourceContext>({
  mentionSource: [],
  setMentionSource: (_: IAccount[] ) => {},
});

const MentionSourceProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [mentionSource, setMentionSource] = useState<IAccount[]>([]);
  return (
    <MentionSourceContext.Provider value={{ mentionSource, setMentionSource }}>
      {children}
    </MentionSourceContext.Provider>
  );
}

const useMentionSourceContextValue = () => useContext(MentionSourceContext);

export { MentionSourceProvider, useMentionSourceContextValue };

export default MentionSourceContext;
