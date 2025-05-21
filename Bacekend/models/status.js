const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database')

const Status = sequelize.define('Status',{
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
}, {
    timestamps: false,
    tableName: 'status',
});

module.exports = Status;