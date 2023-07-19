// used for formatting date from the backend to the frontend
// example:
// const formattedDate = formatDate('2021-06-25');

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
