/**
 * Функция для работы с date
 * @param isoDate
 */
export function getDate(isoDate: string) {
  const dateObject = new Date(isoDate),
    year = dateObject.getFullYear(),
    month = dateObject.getMonth() + 1,
    day = dateObject.getDate(),
    hours = dateObject.getHours(),
    minutes = dateObject.getMinutes();

  return {
    year,
    month: month.toString().padStart(2, "0"),
    day: day.toString().padStart(2, "0"),
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
  };
}
