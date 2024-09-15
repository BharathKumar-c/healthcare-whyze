module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'FeasibilityStudy',
    {
      Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'Id',
      },
      ProjectId: {
        type: DataTypes.UUID,
        field: 'ProjectId',
      },
      Name: {
        type: DataTypes.STRING,
        field: 'Name',
      },
      IsDone: {
        type: DataTypes.BOOLEAN,
        field: 'IsDone',
      },
      FeasibilityStudy: {
        type: DataTypes.JSON,
        field: 'FeasibilityStudy',
      },
      Location: {
        type: DataTypes.JSON,
        field: 'Location',
      },
      SitesContacted: {
        type: DataTypes.JSON,
        field: 'SitesContacted',
      },
      SitesInitiated: {
        type: DataTypes.JSON,
        field: 'SitesInitiated',
      },
      PreferredSites: {
        type: DataTypes.JSON,
        field: 'PreferredSites',
      },
      Sites: {
        type: DataTypes.JSON,
        field: 'Sites',
      },
      FinalCount:{
        type: DataTypes.NUMBER,
        field: 'FinalCount',
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
      tableName: 'FeasibilityStudy',
      timestamps: false,
      underscored: true,
    },
  );
};
