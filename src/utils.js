export function getHour(hour) {
  if (hour < 10)
    return `0${hour}:00`;
  else return `${hour}:00`;
}