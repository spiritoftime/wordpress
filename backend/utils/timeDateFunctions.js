 function addTime(time, duration) {
  const [hours, minutes] = time.split(":").map(Number);
  const newMinutes = (minutes + duration) % 60;
  const newHours = hours + Math.floor(duration / 60);
  const formattedHours = String(newHours).padStart(2, "0");
  const formattedMinutes = String(newMinutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
}
// used for formatting date from the backend to the frontendee
// example:
// const formattedDate = formatDate('2021-06-25');

// console.log(formattedDate); // Output: Fri, Jun 25, 2021, 00:00:00 GMT+8
 function formatDate(dateString) {
  const date = new Date(dateString);
  return date;
}
//  "2023-06-08T16:00:00.000Z"->Thursday, 8 June 2023
 function formatDateToLocale(dateString) {
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
module.exports={
  addTime,
  formatDateToLocale,
  formatDate
}