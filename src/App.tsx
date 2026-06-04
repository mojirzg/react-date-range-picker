import { useState } from 'react';
import { JalaliDateRangePicker, type DateRangeValue } from './components/JalaliDateRangePicker';
import './app.css';

function formatDate(date?: Date) {
  if (!date) return 'Not selected';
  return date.toISOString().slice(0, 10);
}

export default function App() {
  const [range, setRange] = useState<DateRangeValue>({});
  const [singleDate, setSingleDate] = useState<DateRangeValue>({});

  return (
    <main className="demo-page">
      <section className="demo-hero">
        <p className="demo-eyebrow">Production-inspired React component</p>
        <h1>Jalali Date Range Picker</h1>
        <p>
          A standalone, Persian calendar that i built in a real travel marketplace use case and rebuilt as a reusable React + TypeScript component.
        </p>
      </section>

      <section className="demo-grid">
        <article className="demo-card">
          <h2>Range picker</h2>
          <JalaliDateRangePicker mode="range" value={range} onChange={setRange} />
          <pre>{JSON.stringify({ startDate: formatDate(range.startDate), endDate: formatDate(range.endDate), label: range.label }, null, 2)}</pre>
        </article>

        <article className="demo-card">
          <h2>Single date picker</h2>
          <JalaliDateRangePicker mode="single" value={singleDate} onChange={setSingleDate} />
          <pre>{JSON.stringify({ startDate: formatDate(singleDate.startDate), label: singleDate.label }, null, 2)}</pre>
        </article>
      </section>
    </main>
  );
}
