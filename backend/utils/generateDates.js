/**
 * Function to create days array based on the start and end date
 * Example input: createDateArray("2023-07-31T16:00:00.000Z", "2023-08-02T16:00:00.000Z");
 * @param {string} start start date
 * @param {string} end end date
 * @param {array} sessions array of sessions that the speaker is involved during the conference
 * @returns {array} dates in between the start and end date
 * Exaple output: ['Monday, 31 July 2023', 'Tuesday, 1 August 2023', 'Wednesday, 2 August 2023']
 */
const createDateArray = (start, end, sessions) => {
  console.log("createDateArrayFirst", start, end);
  const days = [];
  const startDate = new Date(removeTimeFromDate(start));
  const endDate = new Date(removeTimeFromDate(end));
  const sessionDates = getSessionDates(sessions);
  console.log(sessionDates, "sessionDates");
  console.log(startDate, endDate, sessionDates, "createDateArray");
  const differencesInMiliseconds = endDate.getTime() - startDate.getTime();
  const dayDifferences =
    Math.ceil(differencesInMiliseconds / (1000 * 3600 * 24)) + 1;
  console.log(dayDifferences, "dayDifferences");
  for (let i = 0; i < dayDifferences; i++) {
    const daysInMiliseconds = 86400000 * i;
    const newDay = new Date(
      startDate.getTime() + daysInMiliseconds
    ).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (sessionDates.includes(newDay)) {
      days.push(newDay);
    }
  }

  return days;
};

const getSessionDates = (sessions) => {
  const sessionDates = [];
  sessions.forEach((session) => {
    sessionDates.push(convertDateFormat(removeTimeFromDate(session.date)));
  });

  return sessionDates;
};

/**
 * Function to convert date into dd/mm/yyyy format
 * @param {string} date
 * @returns {string} date in dd/mm/yyyy format
 */
const convertDateFormat = (date) => {
  const newDate = new Date(removeTimeFromDate(date));

  return newDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Function to remove time from ISO-8601 date
 * @param {string} date
 * @returns {string} date only without time
 */
const removeTimeFromDate = (date) => {
  const newDate = date.split("T");
  return newDate[0];
};

/**
 * Function to remove seconds from time
 * Example input removeSecondsFromTime("10:00:00")
 * @param {string} time
 * @returns {string} time without seconds
 * Example out put 10:00
 */
const removeSecondsFromTime = (time) => time.slice(0, -3);

module.exports = {
  createDateArray,
  convertDateFormat,
  removeTimeFromDate,
  removeSecondsFromTime,
};
