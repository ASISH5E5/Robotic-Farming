const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Farm', 'postgres', 'postgres', {
    
    dialect: 'postgres',
    logging:false
});

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database', error.message);
    }
};

module.exports = { connection, sequelize };