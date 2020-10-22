const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV1
    }
});

const Site = sequelize.define('Site', {
    website: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER
    }
});

module.exports = { connectDB, sequelize, User, Site };
