"use strict";
module.exports = (sequelize, DataTypes) => {
  const SavedProduct = sequelize.define(
    "SavedProduct",
    {
      customersId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
    },
    {}
  );
  SavedProduct.associate = function (models) {
    // associations can be defined here
    models.SavedProduct.belongsTo(models.customer, {
      foreignKey: "customersId",
    });
    models.SavedProduct.belongsTo(models.product, { foreignKey: "productId" });
  };
  return SavedProduct;
};
