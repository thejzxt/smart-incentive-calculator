import { useState } from "react";


export function useLocalStorage(key, initialValue) {


  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {

      console.warn(`Error reading localStorage key "${key}", falling back to default data:`, error);
      return initialValue;
    }
  });


  const setValue = (value) => {
    try {

      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
