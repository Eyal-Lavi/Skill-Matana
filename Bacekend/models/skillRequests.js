const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database')

const SkillRequest = sequelize.define('SkillRequest',{
    id:{
        allowNull:false,
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    status:{
        type:DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull:false,
        defaultValue: 'pending',
    },
    requestedBy:{
        type:DataTypes.INTEGER,
        allowNull:false,
        field:'requested_by'
    }
}, {
    timestamps: false,
    tableName: 'skill_requests',
});

module.exports = SkillRequest;