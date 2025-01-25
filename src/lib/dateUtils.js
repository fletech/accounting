import {
  startOfMonth,
  endOfMonth,
  format,
  eachMonthOfInterval,
  subYears,
  addYears,
} from "date-fns";

export function getPeriodDates(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return {
    firstDay: format(start, "yyyy-MM-dd"),
    lastDay: format(end, "yyyy-MM-dd"),
    displayName: format(date, "MMMM yyyy"),
  };
}

export function getAvailablePeriods() {
  // Genera un rango de períodos (ej: 2 años atrás hasta 1 año adelante)
  const start = subYears(new Date(), 2);
  const end = addYears(new Date(), 1);

  return eachMonthOfInterval({ start, end }).map((date) => ({
    value: format(date, "yyyy-MM"),
    label: format(date, "MMMM yyyy"),
    date,
  }));
}

export function formatPeriodDate(date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}${date.getFullYear()}`;
}
