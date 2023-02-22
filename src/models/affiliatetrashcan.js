"use strict";
module.exports = (sequelize, DataTypes) => {
    const affiliatetrashcan = sequelize.define(
        "affiliatetrashcan",
        {
            categoryId: DataTypes.INTEGER,
            subCategoryId: DataTypes.INTEGER,
            childCategoryId: DataTypes.INTEGER,
            custId: DataTypes.INTEGER,
            name: DataTypes.STRING,
            link: DataTypes.STRING,
            status: DataTypes.STRING,
            price: DataTypes.INTEGER,
            currency: DataTypes.STRING,
            photo: DataTypes.STRING,
            sortDesc: DataTypes.TEXT,

        },
        {}
    );
    affiliatetrashcan.associate = function (models) {
        // associations can be defined here
        models.affiliatetrashcan.belongsTo(models.SubCategory, {
            foreignKey: "subCategoryId",
        });
        models.affiliatetrashcan.belongsTo(models.SubChildCategory, { foreignKey: "childCategoryId" });
        models.affiliatetrashcan.belongsTo(models.customer, { foreignKey: "custId" });
    };
    return affiliatetrashcan;
};
