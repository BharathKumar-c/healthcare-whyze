var { getModels, getModelByName } = require('../config/db');
const { Sequelize } = require('sequelize');

const getUniqueMedication = (value) => {
  const Medication = getModelByName('Medication');

  return Medication.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Name')), 'Name']],
    where: {
      Name: { [Sequelize.Op.iLike]: `%${value}%` },
    },
  });
};

const getUniquePatientCondition = (value) => {
  const { PatientCondition } = getModels();

  return PatientCondition.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Name')), 'Name']],
    where: {
      Name: { [Sequelize.Op.iLike]: `%${value}%` },
    },
  });
};

module.exports = { getUniqueMedication, getUniquePatientCondition };
