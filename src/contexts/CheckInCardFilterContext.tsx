import React, { createContext, useContext, PropsWithChildren } from 'react';
import createPersistedState from 'use-persisted-state';

export type TFilterState = 'ALL' | 'ACTIVE' | 'DEACTIVATED';

interface ICheckInCardFilterContext {
  filterState: TFilterState,
  setFilterState: (state: TFilterState) => void,
  selectedStates: string[],
}

const ACTIVE_STATES = ['SCHEDULED', 'WAITING', 'FINISHED'];
const INACTIVE_STATES = ['DEACTIVATED'];

const useCheckInCardFilterState = createPersistedState('checkInCardFilter');

export const FILTER_OPTIONS: { label: TFilterState, states: string[] }[] = [
  { label: 'ALL', states: [...ACTIVE_STATES, ...INACTIVE_STATES] },
  { label: 'ACTIVE', states: ACTIVE_STATES },
  { label: 'DEACTIVATED', states: INACTIVE_STATES },
];

const CheckInCardFilterContext = createContext<ICheckInCardFilterContext>({
  filterState: 'ACTIVE',
  setFilterState: _ => {},
  selectedStates: ACTIVE_STATES,
});

const CheckInCardFilterProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [filterState, setFilterState] = useCheckInCardFilterState('ACTIVE');
  const { states } = FILTER_OPTIONS.find(({ label }) => label === filterState) || { states: ACTIVE_STATES };
  return (
    <CheckInCardFilterContext.Provider value={{ filterState, setFilterState, selectedStates: states }}>
      {children}
    </CheckInCardFilterContext.Provider>
  );
}

const useCheckInCardFilterContextValue = () => useContext(CheckInCardFilterContext);

export { CheckInCardFilterProvider, useCheckInCardFilterContextValue };

export default CheckInCardFilterContext;
