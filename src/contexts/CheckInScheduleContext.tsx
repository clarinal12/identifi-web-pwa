import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useQuery } from 'react-apollo';

import { useUserContextValue } from 'contexts/UserContext';
import { ICheckinData } from 'apollo/types/graphql-types';
import { ALL_CHECKIN_SCHEDULES } from 'apollo/queries/checkin';

interface ICheckInScheduleContext {
  checkInSchedules: ICheckinData[],
  loading: boolean,
}

const CheckInScheduleContext = createContext<ICheckInScheduleContext>({
  checkInSchedules: [],
  loading: true,
});

const CheckInScheduleProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;

  const { loading, data } = useQuery(ALL_CHECKIN_SCHEDULES, {
    skip: !(activeCompany && activeCompany.slackEnabled),
  });

  return (
    <CheckInScheduleContext.Provider
      value={{
        checkInSchedules: (!loading && data) ? [...data.allCheckInSchedules] : [],
        loading,
      }}
    >
      {children}
    </CheckInScheduleContext.Provider>
  );
}

const CheckInScheduleConsumer = CheckInScheduleContext.Consumer;

const useCheckInScheduleContextValue = () => useContext(CheckInScheduleContext);

export { CheckInScheduleProvider, useCheckInScheduleContextValue, CheckInScheduleConsumer };

export default CheckInScheduleContext;
