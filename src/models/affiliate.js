"use strict";
module.exports = (sequelize, DataTypes) => {
    const affiliate = sequelize.define(
        "affiliate",
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
    affiliate.associate = function (models) {
        // associations can be defined here
        models.affiliate.belongsTo(models.SubCategory, {
            foreignKey: "subCategoryId",
        });
        models.affiliate.belongsTo(models.SubChildCategory, { foreignKey: "childCategoryId" });
        models.affiliate.belongsTo(models.customer, { foreignKey: "custId" });
    };
    return affiliate;
};
