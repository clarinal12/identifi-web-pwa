import { DataProxy } from 'apollo-cache/lib/types';

import { ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession } from 'apollo/types/oneOnOne';

interface ICacheHandler {
  agendaId: string,
  sessionId: string,
}

export default ({ sessionId, agendaId }: ICacheHandler) => ({
  update: (store: DataProxy, { data: { deleteOneOnOneAgenda } }: any) => {
    if (!deleteOneOnOneAgenda) return;
    try {
      const oneOnOneSessionCacheData: { oneOnOneSession: IOneOnOneSession } | null = store.readQuery({
        query: ONE_ON_ONE_SESSION,
        variables: { sessionId },
      });
      if (oneOnOneSessionCacheData) {
        oneOnOneSessionCacheData.oneOnOneSession.agenda = oneOnOneSessionCacheData.oneOnOneSession.agenda.filter(({ id }) => {
          return id !== agendaId;
        });
        store.writeQuery({
          query: ONE_ON_ONE_SESSION,
          variables: { sessionId },
          data: oneOnOneSessionCacheData,
        });
      }
    } catch (_) {}
  },
  optimisticResponse: {
    deleteOneOnOneAgenda: true,
  }
});
