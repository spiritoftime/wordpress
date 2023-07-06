/**
 * Function to convert a string to title case
 * @param {string} text
 * @returns {string} text in title case
 */
export const convertToTitleCase = (text) => {
  const textArr = text.split("");
  const firstLetter = textArr[0].toUpperCase();
  textArr[0] = firstLetter;
  return textArr.join("");
};
