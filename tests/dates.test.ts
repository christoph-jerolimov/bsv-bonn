import { describe, expect, it } from 'vitest';

import {
  formatDate,
  formatDateRange,
  formatShortDate,
  isUpcoming,
  toIsoDate,
} from '../src/lib/dates';

describe('date formatting', () => {
  const date = new Date('2026-11-01T00:00:00Z');

  it('formats German dates', () => {
    expect(formatShortDate(date)).toBe('01.11.2026');
    expect(formatDate(date)).toBe('Sonntag, 01.11.2026');
    expect(toIsoDate(date)).toBe('2026-11-01');
  });

  it('formats ranges', () => {
    expect(formatDateRange(date)).toBe('Sonntag, 01.11.2026');
    expect(formatDateRange(date, date)).toBe('Sonntag, 01.11.2026');
    expect(
      formatDateRange(new Date('2026-10-08T00:00:00Z'), new Date('2026-10-15T00:00:00Z')),
    ).toBe('08.10.2026 bis 15.10.2026');
  });
});

describe('isUpcoming', () => {
  const today = new Date('2026-10-18T15:30:00Z');

  it('treats today and future dates as upcoming', () => {
    expect(isUpcoming({ date: new Date('2026-10-18T00:00:00Z') }, today)).toBe(true);
    expect(isUpcoming({ date: new Date('2026-12-12T00:00:00Z') }, today)).toBe(true);
  });

  it('treats past dates as past', () => {
    expect(isUpcoming({ date: new Date('2026-10-17T23:00:00Z') }, today)).toBe(false);
  });

  it('uses the end date for multi day events', () => {
    expect(
      isUpcoming(
        { date: new Date('2026-10-08T00:00:00Z'), endDate: new Date('2026-10-20T00:00:00Z') },
        today,
      ),
    ).toBe(true);
  });
});
