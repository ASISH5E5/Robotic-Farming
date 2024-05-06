'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Investors', 'money', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 100000, // Initial amount
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Investors', 'money');
  }
};
