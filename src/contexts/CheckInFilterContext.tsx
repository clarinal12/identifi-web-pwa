import React, { createContext, useContext, PropsWithChildren } from 'react';
import createPersistedState from 'use-persisted-state';

export type TFilterState = 'ALL' | 'ACTIVE' | 'DEACTIVATED';

interface ICheckInFilterContext {
  filterState: TFilterState,
  setFilterState: (state: TFilterState) => void,
  selectedStates: string[],
}

const ACTIVE_STATES = ['SCHEDULED', 'WAITING', 'FINISHED'];
const INACTIVE_STATES = ['DEACTIVATED'];

const useCheckInFilterState = createPersistedState('checkinFilter');

export const FILTER_OPTIONS: { label: TFilterState, states: string[] }[] = [
  { label: 'ALL', states: [...ACTIVE_STATES, ...INACTIVE_STATES] },
  { label: 'ACTIVE', states: ACTIVE_STATES },
  { label: 'DEACTIVATED', states: INACTIVE_STATES },
];

const CheckInFilterContext = createContext<ICheckInFilterContext>({
  filterState: 'ACTIVE',
  setFilterState: _ => {},
  selectedStates: ACTIVE_STATES,
});

const CheckInFilterProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [filterState, setFilterState] = useCheckInFilterState('ACTIVE');
  const { states } = FILTER_OPTIONS.find(({ label }) => label === filterState) || { states: ACTIVE_STATES };
  return (
    <CheckInFilterContext.Provider value={{ filterState, setFilterState, selectedStates: states }}>
      {children}
    </CheckInFilterContext.Provider>
  );
}

const useCheckInFilterContextValue = () => useContext(CheckInFilterContext);

export { CheckInFilterProvider, useCheckInFilterContextValue };

export default CheckInFilterContext;
