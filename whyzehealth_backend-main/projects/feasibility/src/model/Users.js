module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Users',
    {
      Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'Id',
      },
      Email: {
        type: DataTypes.STRING,
        field: 'Email',
      },
      PhoneNumber: {
        type: DataTypes.STRING,
        field: 'PhoneNumber',
      },
      Tenant: {
        type: DataTypes.STRING,
        field: 'Tenant',
      },
      FirstName: {
        type: DataTypes.STRING,
        field: 'FirstName',
      },
      LastName: {
        type: DataTypes.STRING,
        field: 'LastName',
      },
      Gender: {
        type: DataTypes.STRING,
        field: 'Gender',
      },
      Dob: {
        type: DataTypes.DATE,
        field: 'Dob',
      },
      Country: {
        type: DataTypes.STRING,
        field: 'Country',
      },
      PictureUrl: {
        type: DataTypes.STRING,
        field: 'PictureUrl',
      },
      AccountStatus: {
        type: DataTypes.STRING,
        field: 'AccountStatus',
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
      tableName: 'Users',
      timestamps: false,
      underscored: true,
    },
  );
};
