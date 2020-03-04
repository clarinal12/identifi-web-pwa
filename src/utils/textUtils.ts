import { useState, useEffect } from 'react';

export const getMultipleLines = (text: string) => text.split('\n').map(singleText => singleText);

// react custom hook
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
