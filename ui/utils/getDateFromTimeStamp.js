export default function getDateFromTimestamp(createdAt) {
  const date1 = Math.round(new Date().getTime());
  const date2 = Number(createdAt);

  let difference = date1 - date2;
  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  const hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  const minutesDifference = Math.floor(difference / 1000 / 60);

  const result = daysDifference * 60 * 24 + hoursDifference * 60 + minutesDifference;

  return result;
}
