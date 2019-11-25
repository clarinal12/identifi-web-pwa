declare module 'use-persisted-state' {
  type SetStateAction<S> = S | ((prevState: S) => S);
  function state<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export default function(stateName: string): state;
}
