'use client';

import { Button, Menu, MenuItem, MenuTrigger, Popover } from '@noria/ui';
import { CalendarDays } from 'lucide-react';
import { EventWithRSVPs } from '@/hooks/use-dashboard';
import { generateGoogleCalendarUrl, generateYahooCalendarUrl, generateOutlookCalendarUrl, generateIcsContent } from '@/utils/calendar';

export const AddToCalendar = ({ event }: { event: EventWithRSVPs }) => {
	const handleAction = (key: React.Key) => {
		let url = '';
		if (key === 'google') url = generateGoogleCalendarUrl(event);
		else if (key === 'yahoo') url = generateYahooCalendarUrl(event);
		else if (key === 'outlook') url = generateOutlookCalendarUrl(event);

		if (url) {
			window.open(url, '_blank', 'noopener,noreferrer');
		} else if (key === 'ics') {
			const icsContent = generateIcsContent(event);
			const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.setAttribute('download', `${event.title}.ics`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	return (
		<MenuTrigger>
			<Button variant="secondary" icon={CalendarDays}>
				Add to calendar
			</Button>
			<Popover>
				<Menu onAction={handleAction}>
					<MenuItem id="google">Google Calendar</MenuItem>
					<MenuItem id="yahoo">Yahoo Calendar</MenuItem>
					<MenuItem id="outlook">Outlook Calendar</MenuItem>
					<MenuItem id="ics">Download .ics</MenuItem>
				</Menu>
			</Popover>
		</MenuTrigger>
	);
};
