import { format, formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns";

export const subtractDates = (dateStr1: any, dateStr2: any) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

export const getToday = function (options: { end?: boolean } = {}) {
  const today = new Date();

  if (options.end) today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value: number | bigint) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "INR" }).format(
    value
  );

export const formattedDate = (date: string | number | Date) =>
  date ? format(new Date(date), "dd-MM-yyyy") : "-";

export const parseNumber = (value: string) =>
  isNaN(parseFloat(value)) ? 0 : parseFloat(value);

export function fixed2Decimal(value: string | number | null | undefined) {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "0.00";
  }
  return Number(value).toFixed(2);
}
