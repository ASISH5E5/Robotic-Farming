'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manager extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addadmin({ name, email, password }) {
      return this.create({ name, email, password }); // Fix method call
    }
  }
  Manager.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    MID: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    state: DataTypes.STRING,
    village: DataTypes.STRING,
    pin: DataTypes.INTEGER,
    crop:DataTypes.STRING,
    sum:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Manager',
  });
  return Manager;
};