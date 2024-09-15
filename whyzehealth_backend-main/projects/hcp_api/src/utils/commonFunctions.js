const joinTextWithUnderscore = text => {
  const newText = text.replace(/\s+/g, '_').toLowerCase();

  return newText;
};

const arrayShuffle = array =>
  array
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value);

module.exports = {
  joinTextWithUnderscore,
  arrayShuffle,
};
