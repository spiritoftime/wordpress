import { renderToStaticMarkup } from "react-dom/server";
import { ReactDOM } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getSessions, updateProgram } from "../services/sessions";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import Loading from "./Loading";

import Calendar from "./Calendar";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { convertTimeToDateObj } from "../utils/convertDate";

const ProgramOverview = () => {
  const getAccessToken = useGetAccessToken();
  const { conferenceId } = useParams();
  const html = renderToStaticMarkup(<Calendar />);
  const {
    data: sessions,
    isLoading: isSessionsLoading,
    isFetching: isSessionsFetching,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getSessions(accessToken, conferenceId);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
  console.log(sessions, "sessions");
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
  const createEvents = (sessions) => {
    const events = [];
    for (const session of sessions) {
      const sessionObj = {};
      sessionObj.title = session.title;
      sessionObj.start = convertTimeToDateObj(session.date, session.startTime);
      sessionObj.end = convertTimeToDateObj(session.date, session.endTime);
      sessionObj.description = session.synopsis;
      sessionObj.id = session.id;
      events.push(sessionObj);
    }
    return events;
  };

  // useEffect(() => {
  //   if (!isSessionsFetching) {
  //     const sessionEvents = createEvents(sessions);
  //     console.log(sessionEvents, "sessionEvents");
  //     const calendarHtml = `<code><html lang='en'><head><meta charset='utf-8' /><script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script><script>document.addEventListener('DOMContentLoaded', function() {var calendarEl = document.getElementById('calendar');var calendar = new FullCalendar.Calendar(calendarEl, {initialView: 'dayGridMonth',events:${sessionEvents}, eventRender: function(info) {
  //       var tooltip = new Tooltip(info.el, {
  //         title: info.event.extendedProps.description,
  //         placement: 'top',
  //         trigger: 'hover',
  //         container: 'body'
  //       });
  //     }
  //   });calendar.render();});</script></head><body><div id='calendar'></div></body></html></code>`;
  //     const data = {
  //       content: calendarHtml,
  //       type: "page",
  //     };
  //     updateProgramOverview(data);
  //   }
  // }, [isSessionsFetching]);
  if (isSessionsFetching) return <Loading />;

  const sessionEvents = createEvents(sessions);
  return <Calendar sessionEvents={sessionEvents} />;
};

export default ProgramOverview;
