import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useQuery } from 'react-apollo';

import { useUserContextValue } from 'contexts/UserContext';
import { ICheckinData } from 'apollo/types/checkin';
import { CHECKIN_CARDS } from 'apollo/queries/checkin';

interface ICheckInScheduleContext {
  checkInCards: {
    myCheckIns: ICheckinData[],
    allCheckIns: ICheckinData[],
  },
  loading: boolean,
}

const CheckInScheduleContext = createContext<ICheckInScheduleContext>({
  checkInCards: {
    myCheckIns: [],
    allCheckIns: [],
  },
  loading: true,
});

const CheckInScheduleProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const { account } = useUserContextValue();
  const activeCompany = account?.activeCompany;

  const { loading, data } = useQuery<ICheckInScheduleContext>(CHECKIN_CARDS, {
    skip: !(activeCompany?.slackEnabled),
  });

  return (
    <CheckInScheduleContext.Provider
      value={{
        checkInCards: data?.checkInCards || {
          myCheckIns: [],
          allCheckIns: [],
        },
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
