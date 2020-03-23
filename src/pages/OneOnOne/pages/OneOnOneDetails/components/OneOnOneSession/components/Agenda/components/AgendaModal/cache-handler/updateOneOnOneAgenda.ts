import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession } from 'apollo/types/oneOnOne';
import { IAccount } from 'apollo/types/user';
import { IAgendaFormValues } from '../components/AgendaForm/AgendaForm';

interface ICacheHandler {
  agendaId: string,
  sessionId: string,
  author: IAccount,
  values: IAgendaFormValues,
}

export default ({
  sessionId, author, values, agendaId,
}: ICacheHandler) => ({
  update: (store: DataProxy, { data: { updateOneOnOneAgenda } }: any) => {
    try {
      const oneOnOneSessionCacheData: { oneOnOneSession: IOneOnOneSession } | null = store.readQuery({
        query: ONE_ON_ONE_SESSION,
        variables: { sessionId },
      });
      const agendaIndex = oneOnOneSessionCacheData?.oneOnOneSession.agenda.findIndex(({ id }) => {
        return id === agendaId;
      });
      if (oneOnOneSessionCacheData && typeof agendaIndex === 'number') {
        oneOnOneSessionCacheData.oneOnOneSession.agenda[agendaIndex] = updateOneOnOneAgenda;
        store.writeQuery({
          query: ONE_ON_ONE_SESSION,
          variables: { sessionId },
          data: oneOnOneSessionCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    updateOneOnOneAgenda: {
      id: `optimistic-${agendaId}`,
      ...values,
      author,
      __typename: "OneOnOneAgenda",
    },
  }
});
