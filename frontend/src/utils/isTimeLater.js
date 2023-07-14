export const isTimeLater = (startTime, endTime) => {
  const startTimeParts = startTime.split(":").map(Number);
  const endTimeParts = endTime.split(":").map(Number);
  if (endTimeParts[0] > startTimeParts[0]) {
    return true;
  } else if (endTimeParts[0] === startTimeParts[0]) {
    return endTimeParts[1] > startTimeParts[1];
  }
  return false;
};
