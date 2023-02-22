"use strict";
module.exports = (sequelize, DataTypes) => {
    const SavedAffiliate = sequelize.define(
        "SavedAffiliate",
        {
            customersId: DataTypes.INTEGER,
            productId: DataTypes.INTEGER,
        },
        {}
    );
    SavedAffiliate.associate = function (models) {
        // associations can be defined here
        models.SavedAffiliate.belongsTo(models.customer, {
            foreignKey: "customersId",
        });
        models.SavedAffiliate.belongsTo(models.affiliate, { foreignKey: "productId" });
    };
    return SavedAffiliate;
};
