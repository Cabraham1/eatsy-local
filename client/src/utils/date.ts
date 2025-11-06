import { DateTime } from "luxon";
import { COMMON_DATE_FORMATS } from "@/lib/constants/date";
import type { Dayjs } from "dayjs";
import { removeWhiteSpace } from "./strings";

// Type for supported date inputs
type DateInput = string | number | Date;

// Type for format options
type DateFormat = keyof typeof COMMON_DATE_FORMATS;

/**
 * Formats a date string using the specified format
 * @param date - ISO date string to format
 * @param format - Format key from COMMON_DATE_FORMATS (defaults to 'FULL_DATE_AND_TIME')
 * @returns Formatted date string or null if invalid
 */
export const formatDate = (
  date: string,
  format: DateFormat = "FULL_DATE_AND_TIME"
): string | null => {
  if (!date) return null;

  try {
    const dateTime = DateTime.fromISO(date);

    if (!dateTime.isValid) {
      return null;
    }

    return dateTime.toFormat(COMMON_DATE_FORMATS[format]);
  } catch {
    return null;
  }
};

/**
 * Gets a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param date - Date input (string, number, or Date object)
 * @returns Relative time string or null if invalid
 */
export const getRelativeDate = (date: DateInput): string | null => {
  if (!date) return null;

  try {
    // Handle different input types
    let dateTime: DateTime;

    if (typeof date === "string") {
      dateTime = DateTime.fromISO(date);
    } else if (typeof date === "number") {
      dateTime = DateTime.fromMillis(date);
    } else {
      dateTime = DateTime.fromJSDate(date);
    }

    if (!dateTime.isValid) {
      return null;
    }

    return dateTime.toRelative();
  } catch {
    return null;
  }
};

/**
 * Validates if a date input is valid
 * @param date - Date input to validate
 * @returns True if valid, false otherwise
 */
export const isValidDate = (date: DateInput): boolean => {
  if (!date) return false;

  try {
    let dateTime: DateTime;

    if (typeof date === "string") {
      dateTime = DateTime.fromISO(date);
    } else if (typeof date === "number") {
      dateTime = DateTime.fromMillis(date);
    } else {
      dateTime = DateTime.fromJSDate(date);
    }

    return dateTime.isValid;
  } catch {
    return false;
  }
};

/**
 * Gets current timestamp in ISO format
 * @returns Current ISO timestamp string
 */
export const getCurrentTimestamp = (): string => {
  return DateTime.now().toISO();
};

export const removeDateWhiteSpace = (str: string) => {
  const cleaned = removeWhiteSpace(str);
  const keysToConvert = ["lte", "gte", "between"];
  return keysToConvert.includes(cleaned) ? `${cleaned}D` : cleaned;
};

/**
 * @description  Checks if an index is the first, middle, or last element in an array.
 * @param index - The index to check
 * @param total - The total number of elements in the array
 * @returns True if the index is the first, middle, or last element, false otherwise
 */
export const isFirstOrLastOrMiddle = (index: number, total: number) => {
  if (!total || total === 0) {
    return false;
  }

  const middleIndex = Math.floor(total / 2);

  return index === 0 || index === middleIndex || index === total - 1;
};

/**
 * @description This function will always reduce the number of labels to 6
 * @param data - The data to reduce
 * @param total - The total number of elements in the array
 * @returns The reduced data
 */
export const reduceDataTo6Labels = (data: string[]) => {
  return data.slice(0, 6);
};

/**
 * Converts a dayjs date to UTC ISO string while preserving the local time values.
 * This prevents timezone conversion issues when sending dates to APIs that expect
 * the exact date/time selected by the user.
 *
 * @param date - The dayjs date object
 * @returns ISO string in UTC format with preserved local time values
 *
 * @example
 * // User selects "2025-07-31 12:00:00" in timezone GMT+1
 * // Standard toISOString() would return "2025-07-31T11:00:00.000Z"
 * // This function returns "2025-07-31T12:00:00.000Z"
 */
export const preserveLocalTimeAsUTC = (date: Dayjs): string => {
  return date.format(COMMON_DATE_FORMATS.UTC_DATE_AND_TIME) + "Z";
};

/**
 * Converts a date range to UTC ISO strings while preserving local time values.
 * Useful for date range pickers where you want to send the exact dates
 * selected by the user without timezone conversion.
 *
 * @param dateRange - Array of two dayjs date objects [start, end]
 * @returns Array of two ISO strings in UTC format
 */
export const convertDateRangeToUTC = (dateRange: [Dayjs, Dayjs]): [string, string] => {
  return [preserveLocalTimeAsUTC(dateRange[0]), preserveLocalTimeAsUTC(dateRange[1])];
};
