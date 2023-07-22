import { convertDateFormat, removeSecondsFromTime } from "../utils/convertDate";

const ScheduleTable = ({ conference, dates }) => {
  return (
    <div>
      {dates.map((date, index) => (
        <table
          key={index}
          style={{
            border: "1px solid black",
            marginBottom: "20px",
            width: "60%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  height: "40px",
                  backgroundColor: "#39869B",
                  color: "#FFFFFF",
                  padding: "5px",
                }}
              >
                {date}
              </th>
            </tr>
            {conference.Sessions.map(
              (session, sessionIndex) =>
                convertDateFormat(session.date) === date && (
                  <tr key={sessionIndex}>
                    <td style={{ padding: 0 }}>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr
                            style={{
                              borderTop: "1px solid black",
                            }}
                          >
                            <td
                              style={{
                                padding: "5px",
                                fontWeight: 700,
                                width: "25%",
                              }}
                            >
                              {session.Room.room}
                            </td>
                            <td>
                              <strong>{`(${session.sessionCode}) ${
                                session.title
                              } (${removeSecondsFromTime(
                                session.startTime
                              )} - ${removeSecondsFromTime(
                                session.endTime
                              )}hrs)`}</strong>
                            </td>
                          </tr>
                          {session.Speakers.length > 0 &&
                            session.Speakers.map((speaker, speakerIndex) => (
                              <tr key={speakerIndex}>
                                <td>
                                  <p></p>
                                </td>
                                <td>
                                  <p>- {speaker.SessionSpeaker.role}</p>
                                </td>
                              </tr>
                            ))}
                          {session.Topics.length > 0 &&
                            session.Topics.map((topic, topicIndex) => (
                              <tr key={topicIndex}>
                                <td style={{ padding: "2px 5px" }}>
                                  <p>{`${removeSecondsFromTime(
                                    topic.startTime
                                  )} - ${removeSecondsFromTime(
                                    topic.endTime
                                  )}hrs`}</p>
                                </td>
                                <td>
                                  <p>- {topic.title}</p>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default ScheduleTable;
