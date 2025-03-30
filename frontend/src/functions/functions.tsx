/**
 * Функция для работы с date
 * @param isoDate
 * @param edited
 */
export function getDate(isoDate: string, edited: boolean = true) {
  const dateObject = new Date(isoDate),
    year = dateObject.getFullYear(),
    month = dateObject.getMonth() + 1,
    day = dateObject.getDate(),
    hours = dateObject.getHours(),
    minutes = dateObject.getMinutes();

  return edited
    ? {
        year,
        month: month.toString().padStart(2, "0"),
        day: day.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
      }
    : {
        year,
        month,
        day,
        hours,
        minutes,
      };
}
