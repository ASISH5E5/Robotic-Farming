'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class works extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addadmin({title,amount,date,time}) {
      return this.create({title,amount,date,time }); // Fix method call
    }
  }
  works.init({
  title: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    date: DataTypes.DATE,
    time: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'works',
  });
  return works;
};