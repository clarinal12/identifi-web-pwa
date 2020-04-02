import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useQuery } from 'react-apollo';

import { ICheckinData } from 'apollo/types/checkin';
import { CHECKIN_CARDS } from 'apollo/queries/checkin';
import { useUserContextValue } from 'contexts/UserContext';
import { useCheckInFilterContextValue } from 'contexts/CheckInFilterContext';

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
  const { selectedStates } = useCheckInFilterContextValue();
  const { account } = useUserContextValue();
  const activeCompany = account?.activeCompany;

  const { loading, data } = useQuery<ICheckInScheduleContext>(CHECKIN_CARDS, {
    skip: !(activeCompany?.slackEnabled),
  });

  const checkInCardsSource = data
  ? {
    myCheckIns: data.checkInCards.myCheckIns.filter(({ status }) => selectedStates.includes(status)),
    allCheckIns: data.checkInCards.allCheckIns.filter(({ status }) => selectedStates.includes(status)),
  } : {
    myCheckIns: [],
    allCheckIns: [],
  };

  return (
    <CheckInScheduleContext.Provider
      value={{
        checkInCards: checkInCardsSource,
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
