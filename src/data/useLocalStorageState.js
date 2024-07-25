
import React, { useEffect } from "react";

export default function useLocalStorageState(key, defaultValue = "") {
  const [state, setState] = React.useState(
    () => {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    }
  );

  console.log("component rendered");

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}