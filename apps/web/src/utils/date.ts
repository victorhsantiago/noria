export const formatEventDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
};

export const formatFullDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString();
};
