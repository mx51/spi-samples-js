import { useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../common/spi/common';

function useLocalStorage<Type>(key: string, initialValue: Type): [Type, (value: Type | ((val: Type) => Type)) => void] {
  const readValue = () => {
    try {
      const value = getLocalStorage(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      // console.error(error); // for debugging purposes
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<Type>(readValue);

  const setValue = (value: Type | ((val: Type) => Type)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setLocalStorage(key, JSON.stringify(valueToStore));
    } catch (error) {
      // console.error(error); // for debugging purposes
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
