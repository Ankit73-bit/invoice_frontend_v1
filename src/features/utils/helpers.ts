import { format, formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns";

export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

export const getToday = function (options = {}) {
  const today = new Date();

  if (options?.end) today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "INR" }).format(
    value
  );

export const formattedDate = (date) =>
  date ? format(new Date(date), "dd-MM-yyyy") : "-";

export const parseNumber = (value) =>
  isNaN(parseFloat(value)) ? 0 : parseFloat(value);

export function fixed2Decimal(value) {
  if (isNaN(value) || value === null || value === undefined) {
    return "0.00";
  }
  return parseFloat(value).toFixed(2);
}
