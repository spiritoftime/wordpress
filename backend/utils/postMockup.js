const { formatDateToLocale, addTime } = require("./timeDateFunctions");
const { minifyHtml } = require("./minifyHTML");
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
module.exports = { generateHTML };
