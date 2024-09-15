/* eslint-disable no-extend-native */
/* eslint-disable func-names */

Array.prototype.diff = function (arr2) {
  return this.filter(x => !arr2.includes(x));
};

Array.prototype.intersect = function (arr2) {
  return this.filter(x => arr2.includes(x));
};

module.exports = {
  diff: Array.prototype.diff,
  intersect: Array.prototype.intersect,
};
