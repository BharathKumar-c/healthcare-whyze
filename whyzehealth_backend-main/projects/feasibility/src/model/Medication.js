module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Medication',
    {
      Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'Id',
      },
      Name: {
        type: DataTypes.STRING,
        field: 'Name',
      },
      PatientId: {
        type: DataTypes.UUID,
        field: 'PatientId',
      },
      Dosage: {
        type: DataTypes.INTEGER,
        field: 'Dosage',
      },
      DosageUnit: {
        type: DataTypes.STRING,
        field: 'DosageUnit',
      },
      Frequency: {
        type: DataTypes.INTEGER,
        field: 'Frequency',
      },
      FrequencyUnit: {
        type: DataTypes.STRING,
        field: 'FrequencyUnit',
      },
      ReasonForTaking: {
        type: DataTypes.STRING,
        field: 'ReasonForTaking',
      },
      Created: {
        type: DataTypes.DATE,
        field: 'Created',
      },
      Updated: {
        type: DataTypes.DATE,
        field: 'Updated',
      },
      CreatedBy: {
        type: DataTypes.UUID,
        field: 'CreatedBy',
      },
      UpdatedBy: {
        type: DataTypes.UUID,
        field: 'UpdatedBy',
      },
      IsDeleted: {
        type: DataTypes.CHAR(1),
        field: 'IsDeleted',
      },
    },
    {
      freezeTableName: true,
      tableName: 'Medication',
      timestamps: false,
      underscored: true,
    },
  );
};
