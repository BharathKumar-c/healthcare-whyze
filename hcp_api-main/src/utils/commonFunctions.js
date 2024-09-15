const displayConstant = require('../appConstants/displayConstant');

const joinTextWithUnderscore = text => {
  const newText = text.replace(/\s+/g, '_').toLowerCase();

  return newText;
};

function checkUserIsBelow18(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  const age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())
  ) {
    return age > displayConstant.eighteenYears;
  }

  return age >= displayConstant.eighteenYears;
}
function isBirthdayComingUpAndAbove18(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const age = today.getFullYear() - birthDate.getFullYear();

  if (
    today <= thirtyDaysFromNow &&
    (today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() <= birthDate.getDate())) &&
    age >= displayConstant.eighteenYears
  ) {
    return true;
  }

  return false;
}

const arrayShuffle = array =>
  array
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value);

function calculateAge(birthdate) {
  const currentDate = new Date();
  const birthDate = new Date(birthdate);
  const age = Math.floor(
    (currentDate - birthDate) / (365.25 * 24 * 60 * 60 * 1000),
  );

  return age;
}
module.exports = {
  joinTextWithUnderscore,
  arrayShuffle,
  checkUserIsBelow18,
  isBirthdayComingUpAndAbove18,
  calculateAge,
};
