import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession } from 'apollo/types/oneOnOne';
import { IAccount } from 'apollo/types/user';
import { IAgendaFormValues } from '../components/AgendaForm/AgendaForm';

interface ICacheHandler {
  sessionId: string,
  author: IAccount,
  values: IAgendaFormValues,
}

export default ({
  sessionId, author, values,
}: ICacheHandler) => ({
  update: (store: DataProxy, { data: { addOneOnOneAgenda } }: any) => {
    try {
      const oneOnOneSessionCacheData: { oneOnOneSession: IOneOnOneSession } | null = store.readQuery({
        query: ONE_ON_ONE_SESSION,
        variables: { sessionId },
      });
      if (oneOnOneSessionCacheData) {
        oneOnOneSessionCacheData.oneOnOneSession.agenda.push(addOneOnOneAgenda);
        store.writeQuery({
          query: ONE_ON_ONE_SESSION,
          variables: { sessionId },
          data: oneOnOneSessionCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    addOneOnOneAgenda: {
      id: `optimistic-${Date.now()}`,
      ...values,
      author,
      __typename: "OneOnOneAgenda",
    },
  }
});
