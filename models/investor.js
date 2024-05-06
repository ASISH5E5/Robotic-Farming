'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Investor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addInvestor({ name, email, password }) {
      return this.create({ name, email, password }); // Fix method call
    }
  }
  Investor.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    Account_no: DataTypes.INTEGER,
    money:DataTypes.INTEGER,
    invested:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Investor',
  });
  return Investor;
};