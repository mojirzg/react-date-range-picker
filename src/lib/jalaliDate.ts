import { d2j, j2d, jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js';

export type JalaliDayNumber = number;

export type JalaliDateParts = {
  year: number;
  month: number;
  day: number;
};

export const PERSIAN_WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export function getTodayJalali(): JalaliDateParts {
  const today = toJalaali(new Date());

  return {
    year: today.jy,
    month: today.jm,
    day: today.jd,
  };
}

export function toDayNumber(parts: JalaliDateParts): JalaliDayNumber {
  return j2d(parts.year, parts.month, parts.day);
}

export function fromDayNumber(dayNumber: JalaliDayNumber): JalaliDateParts {
  const value = d2j(dayNumber);

  return {
    year: value.jy,
    month: value.jm,
    day: value.jd,
  };
}

export function toGregorianDate(dayNumber: JalaliDayNumber): Date {
  const { year, month, day } = fromDayNumber(dayNumber);
  const gregorian = toGregorian(year, month, day);

  return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
}

export function formatJalaliDay(dayNumber?: JalaliDayNumber): string {
  if (!dayNumber) return '';

  const { month, day } = fromDayNumber(dayNumber);
  return `${day} ${PERSIAN_MONTHS[month - 1]}`;
}

export function formatJalaliFull(dayNumber?: JalaliDayNumber): string {
  if (!dayNumber) return '';

  const { year, month, day } = fromDayNumber(dayNumber);
  return `${day} ${PERSIAN_MONTHS[month - 1]} ${year}`;
}

export function getMonthLength(year: number, month: number): number {
  return jalaaliMonthLength(year, month);
}

export function moveMonth(year: number, month: number, amount: 1 | -1): JalaliDateParts {
  const nextMonth = month + amount;

  if (nextMonth > 12) {
    return { year: year + 1, month: 1, day: 1 };
  }

  if (nextMonth < 1) {
    return { year: year - 1, month: 12, day: 1 };
  }

  return { year, month: nextMonth, day: 1 };
}

export function getFirstDayOffset(year: number, month: number): number {
  const gregorian = toGregorian(year, month, 1);
  const jsDay = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd).getDay();

  // JavaScript: Sunday = 0. Persian calendar grid starts Saturday = 0.
  return (jsDay + 1) % 7;
}

export function sameDay(a?: JalaliDayNumber, b?: JalaliDayNumber): boolean {
  return typeof a === 'number' && typeof b === 'number' && a === b;
}
