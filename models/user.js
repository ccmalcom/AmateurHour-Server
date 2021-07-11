const { DataTypes } = require('sequelize');
const db = require('../db');
const User = db.define('user', {
    firstName : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    instrument:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    genre: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    admin:{
        type: DataTypes.ENUM('Admin', 'User', 'Test'),
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    socialLinks:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    }
});
module.exports = User;