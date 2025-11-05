import React, { createContext, useContext, useRef } from "react";

const ScrollContext = createContext({});
export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
  const scrollPositionsRef = useRef({});

  const saveScroll = (path, pos) => {
    scrollPositionsRef.current[path] = pos;
  };

  const getScroll = (path) => {
    const pos = scrollPositionsRef.current[path] || 0;
    return pos;
  };

  return (
    <ScrollContext.Provider value={{ saveScroll, getScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};