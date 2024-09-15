module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Patients',
    {
      Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'Id',
      },
      BloodType: {
        type: DataTypes.STRING,
        field: 'BloodType',
      },
      RHType: {
        type: DataTypes.STRING,
        field: 'RHType',
      },
      Ethnicity: {
        type: DataTypes.STRING,
        field: 'Ethnicity',
      },
      Height: {
        type: DataTypes.DECIMAL,
        field: 'Height',
      },
      Weight: {
        type: DataTypes.DECIMAL,
        field: 'Weight',
      },
      BMI: {
        type: DataTypes.STRING,
        field: 'BMI',
      },
      UnitSystem: {
        type: DataTypes.STRING,
        field: 'UnitSystem',
      },
      Address: {
        type: DataTypes.STRING,
        field: 'Address',
      },
      PostCode: {
        type: DataTypes.STRING,
        field: 'PostCode',
      },
      County: {
        type: DataTypes.STRING,
        field: 'County',
      },
      PolicyNumber: {
        type: DataTypes.STRING,
        field: 'PolicyNumber',
      },
      PpsnNumber: {
        type: DataTypes.STRING,
        field: 'PpsnNumber',
      },
      GmsNumber: {
        type: DataTypes.STRING,
        field: 'GmsNumber',
      },
      EmergencyContactName: {
        type: DataTypes.STRING,
        field: 'EmergencyContactName',
      },
      EmergencyContactKindship: {
        type: DataTypes.STRING,
        field: 'EmergencyContactKindship',
      },
      EmergencyContactPhone: {
        type: DataTypes.STRING,
        field: 'EmergencyContactPhone',
      },
      HealthInsurancePlanId: {
        type: DataTypes.UUID,
        field: 'HealthInsurancePlanId',
      },
      IsSmoker: {
        type: DataTypes.CHAR(1),
        field: 'IsSmoker',
      },
      SmokeSince: {
        type: DataTypes.STRING,
        field: 'SmokeSince',
      },
      HealthInsuranceId: {
        type: DataTypes.UUID,
        field: 'HealthInsuranceId',
      },
      Title: {
        type: DataTypes.STRING,
        field: 'Title',
      },
      HasAllergies: {
        type: DataTypes.STRING,
        field: 'HasAllergies',
      },
      HasConditions: {
        type: DataTypes.STRING,
        field: 'HasConditions',
      },
      HasMedications: {
        type: DataTypes.STRING,
        field: 'HasMedications',
      },
      HasFamilyHistoryConditions: {
        type: DataTypes.STRING,
        field: 'HasFamilyHistoryConditions',
      },
      Anonymise: {
        type: DataTypes.STRING,
        field: 'Anonymise',
      },
      Discharged: {
        type: DataTypes.STRING,
        field: 'Discharged',
      },
      SnoozedDate: {
        type: DataTypes.STRING,
        field: 'SnoozedDate',
      },
      ReferringClinicianId: {
        type: DataTypes.UUID,
        field: 'ReferringClinicianId',
      },
      ReferringGpId: {
        type: DataTypes.UUID,
        field: 'ReferringGpId',
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
    },
    {
      freezeTableName: true,
      tableName: 'Patients',
      timestamps: false,
      underscored: true,
    },
  );
};
