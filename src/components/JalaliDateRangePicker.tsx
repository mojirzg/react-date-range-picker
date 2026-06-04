import { useEffect, useMemo, useState } from 'react';
import {
  PERSIAN_MONTHS,
  PERSIAN_WEEK_DAYS,
  formatJalaliDay,
  formatJalaliFull,
  fromDayNumber,
  getFirstDayOffset,
  getMonthLength,
  getTodayJalali,
  moveMonth,
  sameDay,
  toDayNumber,
  toGregorianDate,
  type JalaliDayNumber,
} from '../lib/jalaliDate';
import './JalaliDateRangePicker.css';

export type DateRangeValue = {
  startDate?: Date;
  endDate?: Date;
  label?: {
    startDate?: string;
    endDate?: string;
  };
};

export type JalaliDateRangePickerProps = {
  value?: DateRangeValue;
  mode?: 'single' | 'range';
  minDate?: Date;
  maxDate?: Date;
  onChange: (value: DateRangeValue) => void;
  onClose?: () => void;
  labels?: {
    title?: string;
    start?: string;
    end?: string;
    submit?: string;
    cancel?: string;
    clear?: string;
    noEndDate?: string;
  };
};

const DEFAULT_LABELS = {
  title: 'انتخاب تاریخ',
  start: 'تاریخ رفت',
  end: 'تاریخ برگشت',
  submit: 'تایید',
  cancel: 'انصراف',
  clear: 'پاک کردن',
  noEndDate: 'بدون تاریخ پایان',
};

function dateToDayNumber(date?: Date): JalaliDayNumber | undefined {
  if (!date) return undefined;

  const formatted = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  const year = Number(formatted.find((part) => part.type === 'year')?.value);
  const month = Number(formatted.find((part) => part.type === 'month')?.value);
  const day = Number(formatted.find((part) => part.type === 'day')?.value);

  if (!year || !month || !day) return undefined;
  return toDayNumber({ year, month, day });
}

export function JalaliDateRangePicker({
  value,
  mode = 'range',
  minDate,
  maxDate,
  onChange,
  onClose,
  labels: labelsProp,
}: JalaliDateRangePickerProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const todayParts = useMemo(() => getTodayJalali(), []);
  const today = useMemo(() => toDayNumber(todayParts), [todayParts]);

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = value?.startDate ? fromDayNumber(dateToDayNumber(value.startDate)!) : todayParts;
    return { year: initial.year, month: initial.month };
  });
  const [startDay, setStartDay] = useState<JalaliDayNumber | undefined>(() =>
    dateToDayNumber(value?.startDate),
  );
  const [endDay, setEndDay] = useState<JalaliDayNumber | undefined>(() =>
    dateToDayNumber(value?.endDate),
  );
  const [hoverDay, setHoverDay] = useState<JalaliDayNumber | undefined>();

  const minDay = useMemo(() => dateToDayNumber(minDate), [minDate]);
  const maxDay = useMemo(() => dateToDayNumber(maxDate), [maxDate]);

  useEffect(() => {
    setStartDay(dateToDayNumber(value?.startDate));
    setEndDay(dateToDayNumber(value?.endDate));
  }, [value?.startDate, value?.endDate]);

  const monthLength = getMonthLength(visibleMonth.year, visibleMonth.month);
  const firstDayOffset = getFirstDayOffset(visibleMonth.year, visibleMonth.month);
  const previousMonth = moveMonth(visibleMonth.year, visibleMonth.month, -1);
  const previousMonthLength = getMonthLength(previousMonth.year, previousMonth.month);
  const gridSize = monthLength + firstDayOffset <= 35 ? 35 : 42;

  const days = Array.from({ length: gridSize }, (_, index) => {
    const dayInMonth = index - firstDayOffset + 1;

    if (dayInMonth < 1) {
      return {
        kind: 'previous' as const,
        label: previousMonthLength + dayInMonth,
      };
    }

    if (dayInMonth > monthLength) {
      return {
        kind: 'next' as const,
        label: dayInMonth - monthLength,
      };
    }

    const dayNumber = toDayNumber({
      year: visibleMonth.year,
      month: visibleMonth.month,
      day: dayInMonth,
    });

    return {
      kind: 'current' as const,
      label: dayInMonth,
      dayNumber,
    };
  });

  const previewEnd = hoverDay && startDay && hoverDay > startDay ? hoverDay : undefined;
  const effectiveEnd = endDay ?? previewEnd;

  function isDisabled(dayNumber: JalaliDayNumber) {
    if (minDay && dayNumber < minDay) return true;
    if (maxDay && dayNumber > maxDay) return true;
    return false;
  }

  function isInRange(dayNumber: JalaliDayNumber) {
    if (!startDay || !effectiveEnd) return false;
    return dayNumber > startDay && dayNumber < effectiveEnd;
  }

  function handleSelect(dayNumber: JalaliDayNumber) {
    if (isDisabled(dayNumber)) return;

    if (mode === 'single') {
      setStartDay(dayNumber);
      setEndDay(undefined);
      return;
    }

    if (!startDay || (startDay && endDay)) {
      setStartDay(dayNumber);
      setEndDay(undefined);
      return;
    }

    if (sameDay(startDay, dayNumber)) {
      setStartDay(undefined);
      setEndDay(undefined);
      return;
    }

    if (dayNumber < startDay) {
      setStartDay(dayNumber);
      setEndDay(startDay);
      return;
    }

    setEndDay(dayNumber);
  }

  function handleSubmit() {
    if (!startDay) return;

    const finalEndDay = mode === 'single' ? undefined : endDay;

    onChange({
      startDate: toGregorianDate(startDay),
      endDate: finalEndDay ? toGregorianDate(finalEndDay) : undefined,
      label: {
        startDate: formatJalaliFull(startDay),
        endDate: finalEndDay ? formatJalaliFull(finalEndDay) : undefined,
      },
    });
  }

  function handleClear() {
    setStartDay(undefined);
    setEndDay(undefined);
    onChange({ startDate: undefined, endDate: undefined, label: undefined });
  }

  function goToNextMonth() {
    const next = moveMonth(visibleMonth.year, visibleMonth.month, 1);
    setVisibleMonth({ year: next.year, month: next.month });
  }

  function goToPreviousMonth() {
    const previous = moveMonth(visibleMonth.year, visibleMonth.month, -1);
    setVisibleMonth({ year: previous.year, month: previous.month });
  }

  return (
    <section className="jalali-picker" dir="rtl" aria-label={labels.title}>
      <header className="jalali-picker__header">
        <button type="button" className="jalali-picker__nav" onClick={goToPreviousMonth} aria-label="ماه قبل">
          ›
        </button>
        <strong className="jalali-picker__title">
          {PERSIAN_MONTHS[visibleMonth.month - 1]} {visibleMonth.year}
        </strong>
        <button type="button" className="jalali-picker__nav" onClick={goToNextMonth} aria-label="ماه بعد">
          ‹
        </button>
      </header>

      <div className="jalali-picker__weekdays" aria-hidden="true">
        {PERSIAN_WEEK_DAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="jalali-picker__grid" role="grid">
        {days.map((day, index) => {
          if (day.kind !== 'current') {
            return (
              <span key={`${day.kind}-${index}`} className="jalali-picker__day jalali-picker__day--outside">
                {day.label}
              </span>
            );
          }

          const disabled = isDisabled(day.dayNumber);
          const isStart = sameDay(startDay, day.dayNumber);
          const isEnd = sameDay(endDay, day.dayNumber);
          const className = [
            'jalali-picker__day',
            sameDay(today, day.dayNumber) ? 'jalali-picker__day--today' : '',
            isStart || isEnd ? 'jalali-picker__day--selected' : '',
            isInRange(day.dayNumber) && mode === 'range' ? 'jalali-picker__day--in-range' : '',
            disabled ? 'jalali-picker__day--disabled' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={day.dayNumber}
              type="button"
              role="gridcell"
              className={className}
              disabled={disabled}
              aria-label={formatJalaliFull(day.dayNumber)}
              aria-selected={isStart || isEnd}
              onMouseEnter={() => setHoverDay(day.dayNumber)}
              onMouseLeave={() => setHoverDay(undefined)}
              onFocus={() => setHoverDay(day.dayNumber)}
              onBlur={() => setHoverDay(undefined)}
              onClick={() => handleSelect(day.dayNumber)}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      <div className="jalali-picker__summary">
        <div>
          <span>{labels.start}</span>
          <strong>{formatJalaliDay(startDay) || '—'}</strong>
        </div>
        {mode === 'range' && (
          <div>
            <span>{labels.end}</span>
            <strong>{formatJalaliDay(endDay) || labels.noEndDate}</strong>
          </div>
        )}
      </div>

      <footer className="jalali-picker__actions">
        <button type="button" className="jalali-picker__button jalali-picker__button--primary" disabled={!startDay} onClick={handleSubmit}>
          {labels.submit}
        </button>
        <button type="button" className="jalali-picker__button" onClick={handleClear}>
          {labels.clear}
        </button>
        {onClose && (
          <button type="button" className="jalali-picker__button" onClick={onClose}>
            {labels.cancel}
          </button>
        )}
      </footer>
    </section>
  );
}
