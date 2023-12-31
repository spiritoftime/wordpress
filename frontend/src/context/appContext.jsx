import { useContext, useMemo, useState, useRef } from "react";
import React from "react";
import { useToast } from "../components/ui/use-toast";
import { convertToTitleCase } from "../utils/convertText";

const AppContext = React.createContext();
const MAX_STEPS = 3;
const AppProvider = ({ children }) => {
  const [comboBoxValue, setComboBoxValue] = useState("");
  const [conference, setConference] = useState("");
  const [contact, setContact] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [session, setSession] = useState("");
  const [progress, setProgress] = useState(Math.ceil(100 / MAX_STEPS));
  const [selectedTopics, setSelectedTopics] = useState([]);
  // this is needed to preserve the state for selected rows for data table, and to fill in AddSessionPageThree

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
        selectedTopics,
        setSelectedTopics,
        setComboBoxValue,
        setConference,
        conference,
        showToaster,
        contact,
        setContact,
        speaker,
        setSpeaker,
        session,
        setSession,
        progress,
        setProgress,
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
