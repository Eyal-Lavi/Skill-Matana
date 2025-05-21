const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database')

const Permission = sequelize.define('Permission',{
    id:{
        allowNull:false,
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1,
    }
}, {
    timestamps: false, 
    tableName: 'permissions',
});

module.exports = Permission;