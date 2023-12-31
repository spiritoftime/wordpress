import { renderToStaticMarkup } from "react-dom/server";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getSessions, updateProgram } from "../services/sessions";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import Loading from "./Loading";
import PageHeader from "./PageHeader";

import Calendar from "./Calendar";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { convertTimeToDateObj } from "../utils/convertDate";
import { Switch } from "./ui/switch";

const ProgramOverview = () => {
  const getAccessToken = useGetAccessToken();
  const [isChecked, setIsChecked] = useState(false);
  const { conferenceId } = useParams();
  // const html = renderToStaticMarkup(<Calendar />);
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
  const { mutate: updateProgramOverview, isLoading } = useMutation(
    async (data) => {
      const accessToken = await getAccessToken();
      return updateProgram(accessToken, data);
    }
  );

  const createEvents = (sessions) => {
    if (sessions.length === 0) return { events: [], startDate: new Date() };
    const events = [];
    const startDate = new Date(sessions[0].date);
    for (const session of sessions) {
      const sessionObj = {};
      sessionObj.title = session.title;
      sessionObj.start = convertTimeToDateObj(session.date, session.startTime);
      sessionObj.end = convertTimeToDateObj(session.date, session.endTime);
      sessionObj.description = session.synopsis;
      sessionObj.id = session.id;
      sessionObj.wordpressUrl = session.wordpressUrl;
      events.push(sessionObj);
    }
    return { events, startDate };
  };
  if (isSessionsFetching) return <Loading />;
  const { events: sessionEvents, startDate } = createEvents(sessions);
  const toggleIsPublish = () => {
    setIsChecked((prevIsChecked) => !prevIsChecked);
    const data = {
      content: sessionEvents,
      type: "page",
      conferenceId: conferenceId,
      startDate: startDate,
      isChecked: !isChecked,
    };
    updateProgramOverview(data);
  };
  return (
    <div className="w-full flex flex-col gap-4 container py-10 mx-auto">
      <PageHeader rowType="PROGRAM OVERVIEW" hasButton={false} />
      <div className="flex justify-between mb-5">
        <div>
          {sessions[0]?.Conference?.wordpressUrl && (
            <h2 className="text-base text-left">
              WordPress Link:{" "}
              <a
                href={sessions[0]?.Conference?.wordpressUrl}
                target="_blank"
                rel="noreferrer"
              >
                {sessions[0]?.Conference?.wordpressUrl}
              </a>
            </h2>
          )}
        </div>
        <div className="flex gap-2 ">
          <label>Publish To WordPress</label>
          <Switch checked={isChecked} onCheckedChange={toggleIsPublish} />
        </div>
      </div>
      <Calendar sessionEvents={sessionEvents} startDate={startDate} />
    </div>
  );
};

export default ProgramOverview;
