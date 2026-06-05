export const formatEventDate = (date: string | Date): string => {
	return new Date(date).toLocaleDateString('en-GB', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	});
};

export const formatFullDateTime = (date: string | Date): string => {
	return new Date(date).toLocaleString('en-GB');
};

export const formatEventDateOnly = (date: string | Date): string => {
	return new Date(date).toLocaleDateString('en-GB', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
};

export const formatTimeOnly = (date: string | Date): string => {
	return new Date(date).toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};
