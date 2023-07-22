const { formatDateToLocale, addTime } = require("./timeDateFunctions");
const { minifyHtml } = require("./minifyHTML");
const {
  createDateArray,
  convertDateFormat,
  removeTimeFromDate,
  removeSecondsFromTime,
} = require("./generateDates");
// const data = {
//   title: "TRENDING TECHNOLOGIES – Highway to the Future",
//   synopsis:
//     "This combined symposium of the three leading cataract and refractive societies will take a critical look at trending technologies, some nascent, some current, and some which are finding their place in the sun. We aim to separate the chaff from the wheat and help attendees decide which technologies to take seriously.",
//   startTime: "11:00",
//   endTime: "12:30",
//   presentationDuration: 10,
//   discussionDuration: 5,
//   sessionCode: "S6",
//   location: "Room 2",
//   isPublish: false,
//   date: "2023-06-08T16:00:00.000Z",
//   topics: [
//     {
//       startTime: "11:00",
//       endTime: "11:10",
//       topic: "english",
//       topicId: 4,
//       speakers: [
//         {
//           value: "Bob Ng",
//           label: "Bob Ng",
//         },
//       ],
//     },
//     {
//       startTime: "11:15",
//       endTime: "11:25",
//       topic: "web dev",
//       topicId: 5,
//       speakers: [
//         {
//           value: "David Lee",
//           label: "David Lee",
//         },
//       ],
//     },
//   ],
//   sessionType: "Symposia",
//   speakers: [
//     {
//       speakerRole: "Chair",
//       speaker: [
//         {
//           value: "Harrison Moris",
//           label: "Harrison Moris",
//           id: 1,
//         },
//         {
//           value: "John Doe",
//           label: "John Doe",
//           id: 3,
//         },
//         {
//           value: "Michael Johnson",
//           label: "Michael Johnson",
//           id: 5,
//         },
//       ],
//     },
//   ],
// };
const generateHTML = (data) => {
  const {
    synopsis,
    startTime,
    endTime,
    sessionCode,
    location,
    title,
    date,
    topics,
    sessionType,
    speakers,
    discussionDuration,
  } = data;
  const moderators = concatSpeakers(speakers);

  const moderatorString = moderators
    .map((moderator) => `<p>${moderator}</p>`)
    .join("");

  const topicsString = topics
    .map(({ startTime, endTime, topic, speakers }, index) => {
      const speakerNames = speakers
        .map(({ value: speakerName }) => `<span>${speakerName}</span>`)
        .join("");
      return `<tr class="presentation">
        <td class="presentation-duration">${startTime} - ${endTime}hrs</td>
        <td class="topic">${topic}</td>
        <td class="speaker-name">${speakerNames}</td>
      </tr>
      <tr class="presentation discussion">
        <td class="presentation-duration">${endTime} - ${addTime(
        endTime,
        discussionDuration
      )}</td>
        <td class="topic">Discussion</td>
        <td class="speaker-name"></td>
      </tr>`;
    })
    .join("");

  const htmlPost = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 20px;
  }
  h1 {
    color: #007bff;
  }
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    vertical-align: middle;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    border:none;
  }
  th, td {
          padding: 8px;
    text-align: left;
  }
  th {
    background-color:  #384044;
    color:#fff;
    text-align:center;
  }
  .speaker-name {
    font-weight: bold;
    text-align:center;
  }
  .discussion{
    background-color:#CBD5DC;
  }
  .topic{
    font-weight: bold;
  }
  .synopsis{
    font-size: 16px;
    font-weight: 400;
    font-style: italic;
    margin-bottom: 15px;
  }
  </style>
</head>
<body>
  <h1>(${sessionCode}) ${title}</h1>
  <p><span class="icon">📅</span>${formatDateToLocale(date)}</p>
  <p><span class="icon">⏰</span>${startTime} - ${endTime} hrs</p>
  <p><span class="icon">📍</span>${location}</p>
  <p class="synopsis">${synopsis}</p>
  ${moderatorString}
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Topic</th>
        <th>Speaker</th>
      </tr>
    </thead>
    <tbody>
      ${topicsString}
    </tbody>
  </table>
</body>
</html>`;

  return htmlPost;
};

const concatSpeakers = (speakers) => {
  const res = speakers.map(({ speakerRole, speaker }) => {
    let speakerString = `${speakerRole}:`;
    speaker.map(({ value: speakerName }) => {
      speakerString = speakerString + ` ${speakerName},`;
    });
    return speakerString;
  });
  return res;
};
// const test = async () => {
//   const content = generateHTML(data);
//   // console.log("content", content);
//   const minifiedContent = await minifyHtml(content);
//   console.log("minifiedContent", minifiedContent);
//   return minifiedContent;
// };
// test();

const generateSpeakersPost = (data) => {
  let { biography, photoUrl } = data;

  if (photoUrl === "" || photoUrl === undefined || photoUrl === null) {
    photoUrl =
      "https://firebasestorage.googleapis.com/v0/b/speakers-management.appspot.com/o/photos%2Fdummy.jpg?alt=media&token=c3228433-91c3-4888-a8b1-94edac2b01e7";
  }

  // console.log("generateSpeakerPost photoURL: ", photoUrl);

  const html = `<p style="text-align: left;"><img class="wp-image-34468 size-full alignleft" src="${photoUrl}" id="speakerPhoto" alt="" width="100" />${biography}</p><div style="margin-top: 110px;"><p style="font-weight:700">Summary of Presentation(s)</p><hr /><p>Please click session title(s) for more details<br />All timings are according to Singapore Time (UTC+8)</p></div>`;

  return html;
};

const generateSchedule = (presentations) => {
  // console.log(presentations);
  // console.log(presentations.Conferences[0]);
  const startDate = presentations.Conferences[0].startDate;
  const endDate = presentations.Conferences[0].endDate;
  const sessions = presentations.Conferences[0].Sessions;
  const conference = presentations.Conferences[0];
  const dates = createDateArray(startDate, endDate, sessions);
  let finalSchedule = ``;

  // console.log("conference: ", conference);
  // console.log("sessions: ", sessions);
  // console.log("dates: ", dates);
  // console.log("at generateSchedule");

  if (sessions.length <= 0) {
    finalSchedule = `<div style="font-size: 14px;">No presentations allocation.</div>`;
  } else {
    const schedule = dates
      .map(
        (date) =>
          `<table style="border: 1px solid black; margin-bottom: 20px; width: 100%; border-collapse: collapse;">
      <tbody>
        <tr>
          <th style="text-align: left; height: 40px; background-color: #39869B; color: #FFFFFF; padding: 5px;">
            ${date}
          </th>
        </tr>` +
          conference.Sessions.map((session, sessionIndex) => {
            if (convertDateFormat(session.date) === date) {
              return (
                `<tr key=${sessionIndex}>
                <td style="padding: 0;">
                  <table style="width: 100%;">
                    <tbody>
                      <tr style="border-top: 1px solid black;">
                        <td style="padding: 5px; font-weight: 700; width: 25%;">
                          ${session.Room.room}
                        </td>
                        <td style="width: 75%;">
                          <strong>(${session.sessionCode}) ${
                  session.title
                } (${removeSecondsFromTime(
                  session.startTime
                )} - ${removeSecondsFromTime(session.endTime)}hrs)</strong>
                        </td>
                      </tr>` +
                (session.Speakers.length > 0
                  ? session.Speakers.map((speaker, speakerIndex) => {
                      return `<tr key=${speakerIndex}>
                            <td>
                              <p></p>
                            </td>
                            <td>
                              <p>- ${speaker.SessionSpeaker.role}</p>
                            </td>
                          </tr>`;
                    }).join("")
                  : ``) +
                (session.Topics.length > 0
                  ? session.Topics.map((topic, topicIndex) => {
                      return ` <tr key=${topicIndex}>
                            <td style="padding: 2px 5px;">
                              <p>${removeSecondsFromTime(
                                topic.startTime
                              )} - ${removeSecondsFromTime(
                        topic.endTime
                      )}hrs</p>
                            </td>
                            <td>
                              <p>- ${topic.title}</p>
                            </td>
                          </tr>`;
                    }).join("")
                  : "") +
                `</tbody>
                  </table>
                </td>
              </tr>`
              );
            }
          }).join("") +
          `</tbody>
    </table>`
      )
      .join("");

    finalSchedule = `<div style="font-size: 14px;">${schedule}</div>`;
  }

  return finalSchedule;
};

module.exports = { generateHTML, generateSpeakersPost, generateSchedule };
