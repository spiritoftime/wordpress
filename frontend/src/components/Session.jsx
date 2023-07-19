import { useNavigate, useParams } from "react-router-dom";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { getSession } from "../services/sessions";
import { useQuery } from "@tanstack/react-query";
import { addTime } from "../utils/addTime";
import { Button } from "./ui/button";
import { formatDateToLocale } from "../utils/convertDate";
import Loading from "./Loading";
const Session = () => {
  const { conferenceId, sessionId } = useParams();
  const getAccessToken = useGetAccessToken();
  const {
    data: session,
    isLoading: isSessionLoading,
    isFetching: isSessionFetching,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getSession(accessToken, conferenceId, sessionId);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
  const navigate = useNavigate();
  console.log(session, "session");
  if (isSessionFetching) return <Loading />;
  return (
    <div className="w-full flex flex-col gap-4 p-10">
      <div className="flex justify-between ">
        <h1 className="text-2xl font-bold">{session.title}</h1>
        <Button
          className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]"
          onClick={() => navigate("/edit-session")}
        >
          Edit Session
        </Button>
      </div>
      <div className="flex gap-12">
        <p className="font-bold">{formatDateToLocale(session.date)}</p>
        <p className="font-bold">{`${session.startTime.substring(
          0,
          5
        )}-${session.endTime.substring(0, 5)} hrs`}</p>{" "}
        <p className="font-bold">{session.Room.room}</p>
      </div>
      <p className="w-[80%]">{session.synopsis}</p>
      <table className="table-auto w-[70%]">
        <colgroup>
          <col className=" w-[30%]" />
          <col className=" w-[50%]" />
          <col className=" w-[20%]" />
        </colgroup>
        <thead>
          <tr className="bg-[#384044] text-white">
            <th>Time</th>
            <th>Topic</th>
            <th>Speaker</th>
          </tr>
        </thead>
        <tbody>
          {session.Topics.map(
            ({ endTime, startTime, title: topic, Speakers }) => {
              const speakerNames = Speakers.map(
                ({ fullName }) => `${fullName}`
              ).join(",");
              const speakerCountries = Speakers.map(
                ({ country }) => `${country}`
              ).join(",");
              return (
                <>
                  <tr className=" presentation">
                    <td className="presentation-duration text-center">
                      {startTime.substring(0, 5)} - {endTime.substring(0, 5)}{" "}
                      hrs
                    </td>
                    <td className="topic font-bold">
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </td>
                    <td className="speaker-name">
                      {
                        <div className="flex flex-col">
                          <p className="font-bold text-center">
                            {speakerNames}
                          </p>
                          <p className="text-center">{speakerCountries}</p>
                        </div>
                      }
                    </td>
                  </tr>
                  <tr className=" presentation discussion bg-[#CBD5DC]">
                    <td className="presentation-duration text-center">
                      {endTime.substring(0, 5)} -
                      {addTime(endTime, session.discussionDuration).substring(
                        0,
                        5
                      )}{" "}
                      hrs
                    </td>
                    <td className="topic font-bold">Discussion</td>
                    <td className="speaker-name"></td>
                  </tr>
                </>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Session;
