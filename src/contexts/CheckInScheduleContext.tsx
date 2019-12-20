import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useQuery } from 'react-apollo';

import { useUserContextValue } from 'contexts/UserContext';
import { ICheckinData } from 'apollo/types/graphql-types';
import { CHECKIN_SCHEDULES } from 'apollo/queries/checkin';

interface ICheckInScheduleContext {
  checkInSchedules: ICheckinData[],
}

const CheckInScheduleContext = createContext<ICheckInScheduleContext>({
  checkInSchedules: [],
});

const CheckInScheduleProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;

  const { loading, data } = useQuery(CHECKIN_SCHEDULES, {
    variables: {
      filter: {
        companyId: activeCompany && activeCompany.id,
        participatingOnly: false,
      }
    },
  });

  return (
    <CheckInScheduleContext.Provider
      value={{
        checkInSchedules: (!loading && data) ? [...data.checkInSchedules] : [],
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
