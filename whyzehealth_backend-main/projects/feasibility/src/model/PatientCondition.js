module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'PatientCondition',
    {
      Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'Id',
      },
      Status: {
        type: DataTypes.STRING,
        field: 'Status',
      },
      DiagnosisDay: {
        type: DataTypes.INTEGER,
        field: 'DiagnosisDay',
      },
      DiagnosisMonth: {
        type: DataTypes.INTEGER,
        field: 'DiagnosisMonth',
      },
      DiagnosisYear: {
        type: DataTypes.INTEGER,
        field: 'DiagnosisYear',
      },
      Comment: {
        type: DataTypes.STRING,
        field: 'Comment',
      },
      PatientId: {
        type: DataTypes.UUID,
        field: 'PatientId',
      },
      Kinship: {
        type: DataTypes.STRING,
        field: 'Kinship',
      },
      Icd10Code: {
        type: DataTypes.STRING,
        field: 'Icd10Code',
      },
      Name: {
        type: DataTypes.STRING,
        field: 'Name',
      },
      DiagnosisDate: {
        type: DataTypes.DATE,
        field: 'DiagnosisDate',
      },
      RecoveryDate: {
        type: DataTypes.DATE,
        field: 'RecoveryDate',
      },
      RecoveryDay: {
        type: DataTypes.INTEGER,
        field: 'RecoveryDay',
      },
      RecoveryMonth: {
        type: DataTypes.INTEGER,
        field: 'RecoveryMonth',
      },
      RecoveryYear: {
        type: DataTypes.INTEGER,
        field: 'RecoveryYear',
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
      tableName: 'PatientCondition',
      timestamps: false,
      underscored: true,
    },
  );
};
