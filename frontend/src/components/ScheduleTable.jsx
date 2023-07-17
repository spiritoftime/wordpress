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
            width: "100%",
          }}
        >
          <tbody>
            <tr>
              <th>{date}</th>
            </tr>
            {conference.Sessions.map(
              (session, index) =>
                convertDateFormat(session.date) === date && (
                  <tr key={index}>
                    <td>
                      <table style={{ width: "100%", border: "1px solid red" }}>
                        <tbody>
                          <tr>
                            <td>{session.Room.room}</td>
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
                            session.Speakers.map((speaker, index) => (
                              <tr key={index}>
                                <td>
                                  <p></p>
                                </td>
                                <td>
                                  <p>{speaker.SessionSpeaker.role}</p>
                                </td>
                              </tr>
                            ))}
                          {session.Topics.length > 0 &&
                            session.Topics.map((topic, index) => (
                              <tr key={index}>
                                <td>
                                  <p>{`${removeSecondsFromTime(
                                    topic.startTime
                                  )} - ${removeSecondsFromTime(
                                    topic.endTime
                                  )}hrs`}</p>
                                </td>
                                <td>
                                  <p>{topic.title}</p>
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
