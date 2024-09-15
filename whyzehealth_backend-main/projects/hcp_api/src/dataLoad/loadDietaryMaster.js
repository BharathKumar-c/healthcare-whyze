const { DietaryMaster } = require('../models');

const diet = [
  { name: 'None' },
  { name: 'Vegan' },
  { name: 'Vegetarian' },
  { name: 'Lacto vegetarian' },
  { name: 'Kosher' },
  { name: 'Halaal' },
  { name: 'Lactose Intolerance' },
  { name: 'Gluten Intolerance' },
  { name: 'Wheat Intolerance' },
];

module.exports = {
  loadDiet: () => {
    DietaryMaster.insertMany(diet)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  },
};
