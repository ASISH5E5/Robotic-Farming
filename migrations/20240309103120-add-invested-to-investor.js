'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Investors', 'invested', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue:0, // Initial amount
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Investors', 'invested');
  }
};
