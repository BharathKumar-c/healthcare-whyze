import { format } from 'date-fns';

export function totalPatientFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K'
    : Math.sign(num) * Math.abs(num);
}

export function dateFormatter(dateFormat, date) {
  return format(date || new Date(), dateFormat);
}

export function getDateDifference(date) {
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const firstDate = new Date();
  const secondDate = new Date(date);
  const diffInDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

  if (diffInDays === 0) {
    return '0 day ago';
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else {
    return `${diffInDays} days ago`;
  }
}
