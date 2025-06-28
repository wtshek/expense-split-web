/**
 * Date utility functions to handle date parsing without timezone issues
 */

/**
 * Safely parse a date string (YYYY-MM-DD or YYYY-MM-DD[THH:mm:ss...]) as a local date
 * to avoid timezone conversion issues that cause date shifting.
 * 
 * @param dateString - Date string in format YYYY-MM-DD or ISO format
 * @returns Date object in local timezone
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('T')[0].split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Format a date string for display with month and day
 * 
 * @param dateString - Date string in format YYYY-MM-DD or ISO format
 * @returns Formatted string like "Jun 1"
 */
export function formatDateShort(dateString: string): string {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date string for full display
 * 
 * @param dateString - Date string in format YYYY-MM-DD or ISO format
 * @returns Formatted string based on locale
 */
export function formatDateFull(dateString: string): string {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString();
}

/**
 * Format a month string (YYYY-MM) for display
 * 
 * @param monthString - Month string in format YYYY-MM
 * @returns Formatted string like "June 2024"
 */
export function formatMonth(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}