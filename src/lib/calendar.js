/**
 * Build a Date object from plan_date string + hour/min.
 * plan_date is "YYYY-MM-DD", hour is 0-23, min is 0-59.
 */
function buildDate(planDate, hour, min) {
  const [y, m, d] = planDate.split('-').map(Number);
  return new Date(y, m - 1, d, hour, min, 0);
}

/** Format a Date to ICS DTSTART/DTEND value (local time, no timezone): 20260216T093000 */
function toICSLocal(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    '00'
  );
}

/** Format a Date for Google Calendar URL param: 20260216T093000 (same format) */
function toGoogleDate(date) {
  return toICSLocal(date);
}

/** Escape text for ICS format */
function escapeICS(text) {
  if (!text) return '';
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * Generate a full .ics file string for all stops in a plan.
 */
export function generateICS(planName, planDate, stops) {
  const sorted = [...stops].sort((a, b) => {
    const aMin = (a.start_hour ?? a.startHour) * 60 + (a.start_min ?? a.startMin ?? 0);
    const bMin = (b.start_hour ?? b.startHour) * 60 + (b.start_min ?? b.startMin ?? 0);
    return aMin - bMin;
  });

  const events = sorted.map((stop) => {
    const sh = stop.start_hour ?? stop.startHour;
    const sm = stop.start_min ?? stop.startMin ?? 0;
    const start = buildDate(planDate, sh, sm);
    const end = new Date(start.getTime() + stop.duration * 60000);
    const description = stop.notes || '';

    return [
      'BEGIN:VEVENT',
      `DTSTART:${toICSLocal(start)}`,
      `DTEND:${toICSLocal(end)}`,
      `SUMMARY:${escapeICS(stop.title)}`,
      stop.location ? `LOCATION:${escapeICS(stop.location)}` : null,
      `DESCRIPTION:${escapeICS(description)}`,
      `STATUS:CONFIRMED`,
      `UID:${stop.id}@notethatdown`,
      'END:VEVENT',
    ].filter(Boolean).join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Note That Down//Plan//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS(planName || 'Plan')}`,
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Download the .ics file (triggers Apple Calendar on iOS/macOS, or default calendar app).
 */
export function downloadICS(planName, planDate, stops) {
  const ics = generateICS(planName, planDate, stops);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(planName || 'plan').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open Google Calendar with all stops added as separate events.
 * Google Calendar only supports one event per URL, so we open the first
 * and provide a batch approach: open all in new tabs.
 * For a better UX, we open them sequentially with a small delay.
 */
export function addToGoogleCalendar(planDate, stops) {
  const sorted = [...stops].sort((a, b) => {
    const aMin = (a.start_hour ?? a.startHour) * 60 + (a.start_min ?? a.startMin ?? 0);
    const bMin = (b.start_hour ?? b.startHour) * 60 + (b.start_min ?? b.startMin ?? 0);
    return aMin - bMin;
  });

  sorted.forEach((stop, i) => {
    const sh = stop.start_hour ?? stop.startHour;
    const sm = stop.start_min ?? stop.startMin ?? 0;
    const start = buildDate(planDate, sh, sm);
    const end = new Date(start.getTime() + stop.duration * 60000);
    const details = stop.notes || '';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: stop.title,
      dates: `${toGoogleDate(start)}/${toGoogleDate(end)}`,
      details,
    });
    if (stop.location) params.set('location', stop.location);

    const url = `https://calendar.google.com/calendar/render?${params.toString()}`;

    // Stagger opening tabs so browsers don't block them
    setTimeout(() => {
      window.open(url, '_blank');
    }, i * 600);
  });
}
