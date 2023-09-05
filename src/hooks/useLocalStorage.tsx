import React, { useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/common/spi/common';

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
  onStateChanged?: (state: T) => void
): [T, React.Dispatch<T>] => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    const item = getLocalStorage(key);
    if (typeof item === 'string') {
      return setState(JSON.parse(item));
    }
    return setLocalStorage(key, JSON.stringify(initialValue));
  }, []);

  useEffect(() => {
    setLocalStorage(key, JSON.stringify(state));
    if (onStateChanged) {
      onStateChanged(state);
    }
  }, [state]);

  return [state, setState];
};
