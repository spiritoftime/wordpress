import { useContext, useMemo, useState } from "react";
import React from "react";
import { useToast } from "../components/ui/use-toast";
import { convertToTitleCase } from "../utils/convertText";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [comboBoxValue, setComboBoxValue] = useState("");
  const [conference, setConference] = useState("");
  const { toast } = useToast();

  /**
   * Function to show toaster
   * @param {string} title Title for toaster. Indicate null if not required.
   * @param {string} message Message for toaster. Indicate null if not required.
   * @param {*} variant Either default or destructive. Will default to default.
   */
  const showToaster = (title, message, variant) => {
    toast({
      variant: variant ?? "default",
      title: title && title.length > 0 ? convertToTitleCase(title) : null,
      description:
        message && message.length > 0 ? convertToTitleCase(message) : null,
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
