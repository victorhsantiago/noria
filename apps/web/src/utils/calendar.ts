import { EventWithRSVPs } from '@/hooks/use-dashboard';

const formatGoogleDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
};

const getEndDate = (start: string, durationStr: string | null) => {
	const endObj = new Date(start);
	if (durationStr) {
		// Postgres intervals come as HH:MM:SS or H:MM:SS
		const parts = durationStr.split(':');
		if (parts.length >= 2) {
			const hours = parseInt(parts[0], 10) || 0;
			const minutes = parseInt(parts[1], 10) || 0;
			endObj.setHours(endObj.getHours() + hours);
			endObj.setMinutes(endObj.getMinutes() + minutes);
			return endObj;
		}
	}
	// default 1 hour
	endObj.setHours(endObj.getHours() + 1);
	return endObj;
};

export const generateGoogleCalendarUrl = (event: EventWithRSVPs) => {
	const start = formatGoogleDate(event.start_datetime);
	const endObj = getEndDate(event.start_datetime, event.duration);
	const end = formatGoogleDate(endObj.toISOString());
	
	const url = new URL('https://calendar.google.com/calendar/render');
	url.searchParams.append('action', 'TEMPLATE');
	url.searchParams.append('text', event.title);
	url.searchParams.append('dates', `${start}/${end}`);
	if (event.description) url.searchParams.append('details', event.description);
	url.searchParams.append('location', event.location);
	return url.toString();
};

export const generateYahooCalendarUrl = (event: EventWithRSVPs) => {
	const start = formatGoogleDate(event.start_datetime);
	const endObj = getEndDate(event.start_datetime, event.duration);
	const end = formatGoogleDate(endObj.toISOString());
	
	const url = new URL('https://calendar.yahoo.com/');
	url.searchParams.append('v', '60');
	url.searchParams.append('title', event.title);
	url.searchParams.append('st', start);
	url.searchParams.append('et', end);
	if (event.description) url.searchParams.append('desc', event.description);
	url.searchParams.append('in_loc', event.location);
	return url.toString();
};

export const generateOutlookCalendarUrl = (event: EventWithRSVPs) => {
	const endObj = getEndDate(event.start_datetime, event.duration);
	
	const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
	url.searchParams.append('path', '/calendar/action/compose');
	url.searchParams.append('rru', 'addevent');
	url.searchParams.append('subject', event.title);
	url.searchParams.append('startdt', event.start_datetime);
	url.searchParams.append('enddt', endObj.toISOString());
	if (event.description) url.searchParams.append('body', event.description);
	url.searchParams.append('location', event.location);
	return url.toString();
};

export const generateIcsContent = (event: EventWithRSVPs) => {
	const start = formatGoogleDate(event.start_datetime);
	const endObj = getEndDate(event.start_datetime, event.duration);
	const end = formatGoogleDate(endObj.toISOString());

	return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
};
