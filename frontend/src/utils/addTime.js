// eg:time - 09:00, duration:7
// returns 09:07
export function addTime(time, duration) {
  const [hours, minutes] = time.split(":").map(Number);
  const newMinutes = (minutes + duration) % 60;
  const newHours = hours + Math.floor(duration / 60);
  const formattedHours = String(newHours).padStart(2, "0");
  const formattedMinutes = String(newMinutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
}
