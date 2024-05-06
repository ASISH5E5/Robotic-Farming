'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Managers', 'crop', {
      type: Sequelize.STRING,
      allowNull: true, // Modify as needed
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Managers', 'crop');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
