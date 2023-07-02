// used for formatting date from the backend to the frontendee
// example:
// const formattedDate = formatDate('2021-06-25');

// console.log(formattedDate); // Output: Fri, Jun 25, 2021, 00:00:00 GMT+8
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date;
}
