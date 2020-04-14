import React, { createContext, useContext } from 'react';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ICheckinData } from 'apollo/types/checkin';
import { CHECKIN_CARDS } from 'apollo/queries/checkin';
import { useUserContextValue } from 'contexts/UserContext';
import { useCheckInCardFilterContextValue } from 'contexts/CheckInCardFilterContext';

interface ICheckInScheduleContext {
  checkInCards: {
    myCheckIns: ICheckinData[],
    allCheckIns: ICheckinData[],
  },
  selectedCheckInCard?: ICheckinData,
  loading: boolean,
}

const CheckInScheduleContext = createContext<ICheckInScheduleContext>({
  checkInCards: {
    myCheckIns: [],
    allCheckIns: [],
  },
  loading: true,
});

const CheckInScheduleProvider: React.FC<RouteComponentProps<{ checkin_id: string }>> = ({ children, match }) => {
  const { selectedStates } = useCheckInCardFilterContextValue();
  const { account } = useUserContextValue();
  const activeCompany = account?.activeCompany;

  const { loading, data } = useQuery<ICheckInScheduleContext>(CHECKIN_CARDS, {
    skip: !(activeCompany?.slackEnabled),
  });

  const selectedCheckInCard = data?.checkInCards.allCheckIns.find(({ scheduleId }) => scheduleId === match.params.checkin_id);

  return (
    <CheckInScheduleContext.Provider
      value={{
        checkInCards: data
        ? {
          myCheckIns: data.checkInCards.myCheckIns.filter(({ status }) => selectedStates.includes(status)),
          allCheckIns: data.checkInCards.allCheckIns.filter(({ status }) => selectedStates.includes(status)),
        } : {
          myCheckIns: [],
          allCheckIns: [],
        },
        loading,
        selectedCheckInCard,
      }}
    >
      {children}
    </CheckInScheduleContext.Provider>
  );
}

const CheckInScheduleProviderWithRouter = withRouter(CheckInScheduleProvider);

const CheckInScheduleConsumer = CheckInScheduleContext.Consumer;

const useCheckInScheduleContextValue = () => useContext(CheckInScheduleContext);

export { CheckInScheduleProviderWithRouter, useCheckInScheduleContextValue, CheckInScheduleConsumer };

export default CheckInScheduleContext;
