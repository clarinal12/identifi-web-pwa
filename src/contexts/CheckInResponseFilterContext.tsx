import React, { createContext, useContext, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';

export type TResponseFilterState = {
  memberId: string | string[] | undefined,
  commentId: string | string[] | undefined,
}

interface ICheckInResponseFilterContext {
  responseFilterState: TResponseFilterState,
  setResponseFilterState: (responseFilterState: TResponseFilterState) => void,
}

const CheckInResponseFilterContext = createContext<ICheckInResponseFilterContext>({
  responseFilterState: {
    memberId: undefined,
    commentId: undefined,
  },
  setResponseFilterState: _ => {},
});

const CheckInResponseFilterProvider: React.FC<RouteComponentProps<{ checkin_id: string }>> = ({ location, children, match }) => {
  const queryParams = queryString.parse(location.search);

  const [currentCheckInRoute, setCurrentCheckInRoute] = useState<string>(match.params.checkin_id);

  const [responseFilterState, setResponseFilterState] = useState<TResponseFilterState>({
    memberId: queryParams.memberId || undefined,
    commentId: queryParams.commentId || undefined,
  });

  // reset filterState when changing checkins
  useEffect(() => {
    if (currentCheckInRoute !== match.params.checkin_id) {
      setCurrentCheckInRoute(match.params.checkin_id);
      setResponseFilterState({
        memberId: undefined,
        commentId: undefined,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.checkin_id]);

  return (
    <CheckInResponseFilterContext.Provider value={{ responseFilterState, setResponseFilterState }}>
      {children}
    </CheckInResponseFilterContext.Provider>
  );
}

const CheckInResponseFilterProviderWithRouter = withRouter(CheckInResponseFilterProvider);

const CheckInResponseFilterConsumer = CheckInResponseFilterContext.Consumer;

const useCheckInResponseFilterContextValue = () => useContext(CheckInResponseFilterContext);

export { CheckInResponseFilterProviderWithRouter, useCheckInResponseFilterContextValue, CheckInResponseFilterConsumer };

export default CheckInResponseFilterContext;
