import { useState, useEffect } from 'react';

const useLocalStorage = (key) => {
  // Get the initial state from local storage or use the initial value if not found
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return null;
    }
  });

  // Save the updated state to local storage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
