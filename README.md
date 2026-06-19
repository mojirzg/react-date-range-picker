# Jalali Date Range Picker

A production-inspired **Jalali / Persian date range picker** built with **React + TypeScript**.

This project is based on a calendar/date-range selector originally created for the ZhinTour travel marketplace and rebuilt as a clean, standalone open-source example. The goal is to demonstrate reusable component architecture, Persian/Jalali date handling, range-selection UX, RTL support, accessibility-friendly markup, and production-minded React code.

## Why this project exists

The original calendar was built inside a large production marketplace, where it was used for travel booking and search flows. This repository extracts the core idea and improves it into a public example that can be run independently without private application code.

## Features

- Jalali / Persian calendar support
- Date range selection
- Single-date selection mode
- RTL layout
- Persian month and weekday labels
- Hover preview for date ranges
- Today highlighting
- Disabled date support through `minDate` and `maxDate`
- Clean TypeScript types
- No dependency on Bootstrap, custom icon fonts, private design-system components, or project-specific constants
- Accessible semantic buttons and grid roles
- Responsive layout
- Vite demo app included

## Tech stack

- React
- TypeScript
- Vite
- jalaali-js
- CSS

## Getting started

```bash
npm install
npm run dev
```

Then open the local development URL shown in your terminal.

## Build

```bash
npm run build
```

## Basic usage

```tsx
import { useState } from 'react';
import {
  JalaliDateRangePicker,
  type DateRangeValue,
} from './components/JalaliDateRangePicker';

export default function BookingSearch() {
  const [dateRange, setDateRange] = useState<DateRangeValue>({});

  return (
    <JalaliDateRangePicker
      mode="range"
      value={dateRange}
      onChange={setDateRange}
    />
  );
}
```

## Single-date mode

```tsx
const [selectedDate, setSelectedDate] = useState<DateRangeValue>({});

<JalaliDateRangePicker
  mode="single"
  value={selectedDate}
  onChange={setSelectedDate}
/>;
```

## Range mode with date limits

```tsx
<JalaliDateRangePicker
  mode="range"
  minDate={new Date()}
  maxDate={new Date(2026, 11, 31)}
  value={dateRange}
  onChange={setDateRange}
/>;
```

## Custom labels

```tsx
<JalaliDateRangePicker
  mode="range"
  value={dateRange}
  onChange={setDateRange}
  labels={{
    title: 'انتخاب بازه سفر',
    start: 'تاریخ رفت',
    end: 'تاریخ برگشت',
    submit: 'ثبت تاریخ',
    clear: 'حذف',
    cancel: 'بستن',
    noEndDate: 'انتخاب نشده',
  }}
/>;
```

## Returned value

`onChange` returns a normalized object:

```ts
type DateRangeValue = {
  startDate?: Date;
  endDate?: Date;
  label?: {
    startDate?: string;
    endDate?: string;
  };
};
```

Example output:

```json
{
  "startDate": "2026-03-22",
  "endDate": "2026-03-27",
  "label": {
    "startDate": "2 فروردین 1405",
    "endDate": "7 فروردین 1405"
  }
}
```

## Component API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'single' \| 'range'` | `'range'` | Select one date or a start/end range. |
| `value` | `DateRangeValue` | `{}` | Controlled selected value. |
| `onChange` | `(value: DateRangeValue) => void` | Required | Called when the user submits or clears the selection. |
| `minDate` | `Date` | `undefined` | Disables days before this date. |
| `maxDate` | `Date` | `undefined` | Disables days after this date. |
| `onClose` | `() => void` | `undefined` | Optional close handler, useful when the component is used inside a modal/popover. |
| `labels` | object | Persian defaults | Customize UI labels. |

## What was improved from the original production version

The original implementation worked in the ZhinTour app, but it depended on project-specific pieces such as private UI components, SCSS variables, icon fonts, Bootstrap utility classes, and global constants. This version improves the code by:

- Making the picker portable and framework-light
- Removing private app dependencies
- Replacing custom modal/input/button dependencies with a standalone component
- Adding clearer TypeScript types
- Separating Jalali date utilities into `src/lib/jalaliDate.ts`
- Supporting controlled values
- Supporting single and range mode in the same component
- Adding min/max date constraints
- Improving naming, readability, and maintainability
- Adding a demo app and documentation
- Improving accessibility with button semantics and ARIA labels

This project demonstrates:

- Product engineering experience from a real marketplace use case
- Frontend architecture and component extraction
- React state design
- TypeScript API design
- Localization and RTL implementation
- Date/calendar logic
- UX polish for booking/search workflows
- Ability to turn production work into reusable open-source-quality code

## License

MIT
