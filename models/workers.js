'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addadmin({name, email,password,phone }) {
      return this.create({name, email,password,phone  }); // Fix method call
    }
  }
  workers.init({
    name: DataTypes.STRING,
    email:DataTypes.STRING,
    password:DataTypes.STRING,
    phone: DataTypes.INTEGER,
    wid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'workers',
  });
  return workers;
};