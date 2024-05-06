'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addadmin({ name,amount,accept,cid,iid}) {
      return this.create({ name, amount,accept,cid,iid }); // Fix method call
    }
  }
  requests.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    accept: DataTypes.BOOLEAN,
    cid:DataTypes.INTEGER,
    iid:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'requests',
  });
  return requests;
};