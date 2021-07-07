const { DataTypes } = require('sequelize');
const db = require('../db');

const Comment = db.define('comment', {
    content:{
        type: DataTypes.STRING
    },
    posterName:{
        type: DataTypes.STRING
    }
})

module.exports = Comment;