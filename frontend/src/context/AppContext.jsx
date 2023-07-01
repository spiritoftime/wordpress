import { useContext, useMemo, useState } from "react";
import React from "react";
const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [comboBoxValue, setComboBoxValue] = useState("");
  return (
    <AppContext.Provider value={{ comboBoxValue, setComboBoxValue }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => {
  return useContext(AppContext);
};
export { AppProvider };
