export function getHour(hour) {
  if (hour < 10)
    return `0${hour}:00`;
  else return `${hour}:00`;
}

export function getRange(start, end) {
  if (!start || !end)
    return [];
  return [...new Array(end - start + 1).keys()].map(e => e + start);
}