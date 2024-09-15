const {
  feetToCmConversionValue,
  inchesToCmConversionValue,
  stoneToKgConversionValue,
  poundToKgConversionValue,
  kilogram,
  centimeter,
  kgToLbConversionValue,
} = require('../appConstants/displayConstant');

const feetToCmConversion = height => {
  const result = height * feetToCmConversionValue;
  return result;
};

const inchesToCmConversion = height => {
  const result = height * inchesToCmConversionValue;
  return result;
};

function cmToFeetConversion(lengthCm) {
  const lengthIn = lengthCm / inchesToCmConversionValue;
  const feet = Math.floor(lengthIn / 12);
  return feet;
}

function cmToInchesConversion(lengthCm) {
  const lengthIn = lengthCm / inchesToCmConversionValue;
  const inches = Math.round(lengthIn % 12);
  return inches;
}

const stoneToKgConversion = weight => {
  const result = weight * stoneToKgConversionValue;
  return result;
};

const poundToKgConversion = weight => {
  const result = weight * poundToKgConversionValue;
  return result;
};

const kgToStoneConversion = weight => {
  const totalPounds = weight * kgToLbConversionValue;
  const stones = Math.floor(totalPounds / 14);
  return stones;
};

const kgToPoundConversion = weight => {
  const totalPounds = weight * kgToLbConversionValue;
  const pounds = Math.round(totalPounds % 14);

  return pounds;
};

const weightConversion = (weight, unit) => {
  if (unit === kilogram) {
    return weight;
  }

  const [stones, pounds] = weight.toString().split('.');
  const stoneToKgValue = stoneToKgConversion(parseInt(stones, 10));
  const poundToKgValue = pounds ? poundToKgConversion(parseInt(pounds, 10)) : 0;
  const totalWeight = (stoneToKgValue + poundToKgValue).toFixed(2);

  return totalWeight;
};

const heightConversion = (height, unit) => {
  if (unit === centimeter) {
    return height;
  }

  const [feet, inches] = height.toString().split('.');
  const feetToCmValue = feetToCmConversion(parseInt(feet, 10));
  const inchesToCmValue = inches
    ? inchesToCmConversion(parseInt(inches, 10))
    : 0;
  const totalHeight = (feetToCmValue + inchesToCmValue).toFixed(2);

  return totalHeight;
};

const getWeightConversion = (weight, unit) => {
  if (weight === '0') {
    return '';
  }
  if (unit === kilogram) {
    return weight;
  }
  const stones = kgToStoneConversion(weight);
  const pounds = kgToPoundConversion(weight);

  return `${stones}.${pounds}`;
};

const getHeightConversion = (height, unit) => {
  if (height === '0') {
    return '';
  }
  if (unit === centimeter) {
    return height;
  }
  const feet = cmToFeetConversion(height);
  const inches = cmToInchesConversion(height);

  return `${feet}.${inches}`;
};

module.exports = {
  weightConversion,
  heightConversion,
  getHeightConversion,
  getWeightConversion,
  feetToCmConversion,
  inchesToCmConversion,
  stoneToKgConversion,
  poundToKgConversion,
};
