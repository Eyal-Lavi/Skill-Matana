const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database');

const PasswordResetToken = sequelize.define('PasswordResetToken' , {
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    token:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    expiresAt:{
        type:DataTypes.DATE,
        allowNull:false
    },
    used:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    tableName:'password_reset_token',
    timestamps:false
});

module.exports = PasswordResetToken;