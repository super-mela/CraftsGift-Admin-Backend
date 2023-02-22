"use strict";
module.exports = (sequelize, DataTypes) => {
    const producttrashcan = sequelize.define(
        "producttrashcan",
        {
            categoryId: DataTypes.INTEGER,
            subCategoryId: DataTypes.INTEGER,
            childCategoryId: DataTypes.INTEGER,
            custId: DataTypes.INTEGER,
            name: DataTypes.STRING,
            slug: DataTypes.STRING,
            brand: DataTypes.STRING,
            unitSize: DataTypes.STRING,
            status: DataTypes.STRING,
            buyerPrice: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            qty: DataTypes.INTEGER,
            discountPer: DataTypes.INTEGER,
            discount: DataTypes.INTEGER,
            total: DataTypes.INTEGER,
            netPrice: DataTypes.INTEGER,
            photo: DataTypes.STRING,
            sortDesc: DataTypes.TEXT,
            desc: DataTypes.TEXT,
        },
        {}
    );
    producttrashcan.associate = function (models) {
        // associations can be defined here
        models.product.belongsTo(models.SubCategory, { foreignKey: "subCategoryId" });
        models.product.belongsTo(models.SubChildCategory, { foreignKey: "childCategoryId" });
        models.product.belongsTo(models.customer, { foreignKey: "custId" });
    };
    return producttrashcan;
};
