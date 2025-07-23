const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database')

const SkillStatus = sequelize.define('SkillStatus',{
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
    tableName: 'skill_status',
});

module.exports = SkillStatus;