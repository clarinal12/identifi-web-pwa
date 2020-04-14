import React, { createContext, useContext, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery } from 'react-apollo';

import { CHECKIN_PARTICIPANTS } from 'apollo/queries/checkin';
import { IAccount } from 'apollo/types/user';
import { TCheckInParticipant } from 'apollo/types/checkin';

interface IMentionSourceContext {
  mentionSource: IAccount[],
  filterSource: IAccount[],
  loading: boolean,
}

const MentionSourceContext = createContext<IMentionSourceContext>({
  mentionSource: [],
  filterSource: [],
  loading: true,
});

const MentionSourceProvider: React.FC<RouteComponentProps<{ checkin_id: string  }>> = ({ children, match }) => {
  const [mentionSource, setMentionSource] = useState<IAccount[]>([]);
  const [filterSource, setFilterSource] = useState<IAccount[]>([]);

  // initializing mentionables
  const { loading } = useQuery<{ checkInParticipants: TCheckInParticipant[] }>(CHECKIN_PARTICIPANTS, {
    variables: { checkInScheduleId: match.params.checkin_id },
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ checkInParticipants }) => {
      const mentionables = checkInParticipants.map(({ member }) => member);
      const filterSource = checkInParticipants
        .filter(({ role }) => role === 'RESPONDENT')
        .map(({ member }) => member);
      setMentionSource(mentionables);
      setFilterSource(filterSource);
    },
    skip: !Boolean(match.params.checkin_id),
  });

  return (
    <MentionSourceContext.Provider
      value={{
        mentionSource,
        filterSource,
        loading,
      }}
    >
      {children}
    </MentionSourceContext.Provider>
  );
}

const MentionSourceProviderWithRouter = withRouter(MentionSourceProvider);

const useMentionSourceContextValue = () => useContext(MentionSourceContext);

export { MentionSourceProviderWithRouter, useMentionSourceContextValue };

export default MentionSourceContext;
