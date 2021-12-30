const { DataTypes } = require('sequelize');
const db = require('../db');

const Gig = db.define('gig', {
    location: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instrument: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    genre: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    size: {
        type: DataTypes.INTEGER || DataTypes.STRING
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    posterName: {
        type: DataTypes.STRING
    }
})

module.exports = Gig;