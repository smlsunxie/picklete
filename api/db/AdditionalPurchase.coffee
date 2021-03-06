
module.exports = (sequelize, DataTypes) ->
  AdditionalPurchase = sequelize.define('AdditionalPurchase', {
    name: DataTypes.STRING
    discount: DataTypes.FLOAT
    startDate: DataTypes.DATE
    endDate: DataTypes.DATE
  }, classMethods: associate: (models) ->
    AdditionalPurchase.hasOne models.Product
    return
  )
  return AdditionalPurchase
