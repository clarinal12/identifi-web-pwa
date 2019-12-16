import React, { createContext, useContext, PropsWithChildren, useState } from 'react';

interface IPastCheckInContext {
  pastCheckInId: string,
  setPastCheckInId: (id: string) => void
}

const PastCheckInContext = createContext<IPastCheckInContext>({
  pastCheckInId: '',
  setPastCheckInId: (_: string) => {},
});

const PastCheckInProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [pastCheckInId, setPastCheckInId] = useState('');
  return (
    <PastCheckInContext.Provider value={{ pastCheckInId, setPastCheckInId }}>
      {children}
    </PastCheckInContext.Provider>
  );
}

const usePastCheckInContextValue = () => useContext(PastCheckInContext);

export { PastCheckInProvider, usePastCheckInContextValue };

export default PastCheckInContext;
