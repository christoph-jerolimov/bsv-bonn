const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** Formats a date as `Sonntag, 01.11.2026`. */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** Formats a date as `01.11.2026`. */
export function formatShortDate(date: Date): string {
  return shortDateFormatter.format(date);
}

/** Formats a date range as `08.10.2026 bis 15.10.2026` or a single date. */
export function formatDateRange(start: Date, end?: Date): string {
  if (!end || isSameDay(start, end)) {
    return formatDate(start);
  }
  return `${shortDateFormatter.format(start)} bis ${shortDateFormatter.format(end)}`;
}

/** Returns the date as `YYYY-MM-DD` for `datetime` attributes. */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isSameDay(a: Date, b: Date): boolean {
  return toIsoDate(a) === toIsoDate(b);
}

/** Start of the given day in UTC; used to decide whether an event is upcoming. */
export function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** An event is upcoming while its (end) date has not passed yet. */
export function isUpcoming(event: { date: Date; endDate?: Date }, today: Date): boolean {
  const last = event.endDate ?? event.date;
  return startOfDay(last).getTime() >= startOfDay(today).getTime();
}
