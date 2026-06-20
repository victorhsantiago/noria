function getFrequencyType(frequency: string): 'weekly' | 'biweekly' | 'monthly' | 'workday' | 'none' {
	if (frequency.startsWith('weekly on')) return 'weekly';
	if (frequency.startsWith('every other')) return 'biweekly';
	if (frequency.startsWith('monthly on the first')) return 'monthly';
	if (frequency === 'every workday') return 'workday';
	return 'none';
}

export function generateOccurrences(anchorDate: Date, frequency: string, targetHorizon: Date): Date[] {
	const occurrences: Date[] = [];
	const dayOfWeek = anchorDate.getDay();
	const hours = anchorDate.getHours();
	const minutes = anchorDate.getMinutes();

	const type = getFrequencyType(frequency);
	switch (type) {
		case 'weekly': {
			const current = new Date(anchorDate);
			while (true) {
				current.setDate(current.getDate() + 7);
				if (current > targetHorizon) break;
				occurrences.push(new Date(current));
			}
			break;
		}
		case 'biweekly': {
			const current = new Date(anchorDate);
			while (true) {
				current.setDate(current.getDate() + 14);
				if (current > targetHorizon) break;
				occurrences.push(new Date(current));
			}
			break;
		}
		case 'monthly': {
			const startYear = anchorDate.getFullYear();
			const startMonth = anchorDate.getMonth();
			// Look up to 24 months out to find all matching occurrences up to the targetHorizon
			for (let i = 1; i <= 24; i++) {
				const targetMonth = startMonth + i;
				const tempDate = new Date(startYear, targetMonth, 1, hours, minutes, 0, 0);
				while (tempDate.getDay() !== dayOfWeek) {
					tempDate.setDate(tempDate.getDate() + 1);
				}
				if (tempDate > targetHorizon) break;
				if (tempDate > anchorDate) {
					occurrences.push(new Date(tempDate));
				}
			}
			break;
		}
		case 'workday': {
			const current = new Date(anchorDate);
			while (true) {
				current.setDate(current.getDate() + 1);
				if (current > targetHorizon) break;
				const day = current.getDay();
				if (day >= 1 && day <= 5) {
					occurrences.push(new Date(current));
				}
			}
			break;
		}
		default:
			break;
	}

	return occurrences;
}

export function generateOccurrencesOneYear(anchorDate: Date, frequency: string): Date[] {
	const horizon = new Date(anchorDate);
	horizon.setFullYear(horizon.getFullYear() + 1);
	return generateOccurrences(anchorDate, frequency, horizon);
}
