// used for formatting date from the backend to the frontend
// example:
// const formattedDate = formatDate('2021-06-25');

import { fi } from "date-fns/locale";

// console.log(formattedDate); // Output: Fri, Jun 25, 2021, 00:00:00 GMT+8
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date;
}
//  "2023-06-08T16:00:00.000Z"->Thursday, 8 June 2023
export function formatDateToLocale(dateString) {
  const dateObj = new Date(dateString);

  // Step 2: Format the date object to the desired output format
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = dateObj.toLocaleDateString(undefined, options);
  return formattedDate;
}
// convert "09:00:00" + "2021-07-08T00:00:00.000Z" to a date object
export function convertTimeToDateObj(date, timeString) {
  // Combine the date and time strings
  const combinedDateTimeStr = date.slice(0, 10) + "T" + timeString; // '2021-07-08T09:00:00'

  // Create a Date object from the combined date and time string
  const dateObj = new Date(combinedDateTimeStr);
  return dateObj;
}

/**
 * Function to remove time from ISO-8601 date
 * @param {string} date
 * @returns {string} date only without time
 */
export const removeTimeFromDate = (date) => {
  const newDate = date.split("T");
  return newDate[0];
};

/**
 * Function to create days array based on the start and end date
 * Example input: createDateArray("2023-07-31T16:00:00.000Z", "2023-08-02T16:00:00.000Z");
 * @param {string} start start date
 * @param {string} end end date
 * @param {array} sessions array of sessions that the speaker is involved during the conference
 * @returns {array} dates in between the start and end date
 * Exaple output: ['Monday, 31 July 2023', 'Tuesday, 1 August 2023', 'Wednesday, 2 August 2023']
 */
export const createDateArray = (start, end, sessions) => {
  const days = [];
  const startDate = new Date(removeTimeFromDate(start));
  const endDate = new Date(removeTimeFromDate(end));
  const sessionDates = getSessionDates(sessions);

  const differencesInMiliseconds = endDate.getTime() - startDate.getTime();
  const dayDifferences =
    Math.ceil(differencesInMiliseconds / (1000 * 3600 * 24)) + 1;

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

export const getSessionDates = (sessions) => {
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
export const convertDateFormat = (date) => {
  const newDate = new Date(removeTimeFromDate(date));

  return newDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Function to remove seconds from time
 * Example input removeSecondsFromTime("10:00:00")
 * @param {string} time
 * @returns {string} time without seconds
 * Example out put 10:00
 */
export const removeSecondsFromTime = (time) => time.slice(0, -3);
