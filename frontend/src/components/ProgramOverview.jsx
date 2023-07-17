import { renderToStaticMarkup } from "react-dom/server";
import { ReactDOM } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateProgram } from "../services/sessions";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";

import Calendar from "./Calendar";
import { useEffect } from "react";

const ProgramOverview = () => {
  const getAccessToken = useGetAccessToken();

  const html = renderToStaticMarkup(<Calendar />);

  const { mutate: updateProgramOverview, isLoading } = useMutation(
    async (data) => {
      const accessToken = await getAccessToken();
      return updateProgram(accessToken, data);
    }
    // {
    //   onSuccess: () => {

    //     navigate(`/conferences/speakers/${conferenceId}`);
    //     showToaster("Speakers Added");
    //   },
    // }
  );

  // const calendarHtml = ReactDOM.createRoot(document.getElementById("calendar"));

  const calendarHtml = `<code><html lang='en'><head><meta charset='utf-8' /><script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script><script>document.addEventListener('DOMContentLoaded', function() {var calendarEl = document.getElementById('calendar');var calendar = new FullCalendar.Calendar(calendarEl, {initialView: 'dayGridMonth'});calendar.render();});</script></head><body><div id='calendar'></div></body></html></code>`;

  useEffect(() => {
    console.log("At useEffect");
    console.log(html);
    const data = {
      content: calendarHtml,
      type: "page",
    };
    updateProgramOverview(data);
  }, []);

  return <Calendar />;
};

export default ProgramOverview;
