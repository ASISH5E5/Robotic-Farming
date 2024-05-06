'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Managers', 'sum', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue:0, // Initial amount
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Managers', 'sum');
  }
};
