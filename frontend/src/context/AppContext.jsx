import { useContext, useMemo, useState } from "react";
import React from "react";
import { useToast } from "../components/ui/use-toast";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [comboBoxValue, setComboBoxValue] = useState("");
  const [conference, setConference] = useState("");
  const { toast } = useToast();
  const showToaster = (message) => {
    toast({
      description: message,
    });
  };

  return (
    <AppContext.Provider
      value={{
        comboBoxValue,
        setComboBoxValue,
        setConference,
        conference,
        showToaster,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => {
  return useContext(AppContext);
};
export { AppProvider };
