module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Projects',
    {
      Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'Id',
      },
      UserId: {
        type: DataTypes.UUID,
        field: 'UserId',
      },
      ProjectName: {
        type: DataTypes.STRING,
        field: 'ProjectName',
      },
      ClientName: {
        type: DataTypes.STRING,
        field: 'ClientName',
      },
      Description: {
        type: DataTypes.STRING,
        field: 'Description',
      },
      PatientSegmentReqiured: {
        type: DataTypes.INTEGER,
        field: 'PatientSegmentReqiured',
      },
      IsFavourite: {
        type: DataTypes.BOOLEAN,
        field: 'IsFavourite',
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
      tableName: 'Projects',
      timestamps: false,
      underscored: true,
    },
  );
};
