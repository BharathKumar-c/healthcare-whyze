const moment = require('moment');

const dateFormatter = date => {
  const format = date.split('/');
  const newDate = new Date(
    `${format[2]}-${format[1]}-${format[0]}T00:00:00.000Z`,
  );
  return newDate;
};
const startDateFormatter = date => {
  const format = date.split('/');
  const newDate = new Date(
    `${format[2]}-${format[1]}-${format[0]}T00:00:00.000Z`,
  );
  return newDate;
};
const endDateFormatter = date => {
  const format = date.split('/');
  const newDate = new Date(
    `${format[2]}-${format[1]}-${format[0]}T23:59:59.999Z`,
  );
  return newDate;
};
const dateformatToStringddmmyy = date => {
  const newDate = moment(date).format('DD/MM/YYYY');
  return newDate;
};
const isoDateFormat = iso => {
  const isoDate = iso;

  const newDate = moment.utc(isoDate).format('MM/YYYY');
  return newDate;
};

const timeRoundOff = (futureHours, roundOffMinutes, fromTime) => {
  const futureDate = moment(fromTime).add(futureHours, 'hours');
  // Round the future time to the nearest needed minutes
  const roundedFutureDate = moment(
    Math.ceil(futureDate / (roundOffMinutes * 60 * 1000)) *
      (roundOffMinutes * 60 * 1000),
  );
  return roundedFutureDate;
};

module.exports = {
  dateFormatter,
  startDateFormatter,
  endDateFormatter,
  isoDateFormat,
  dateformatToStringddmmyy,
  timeRoundOff,
};
