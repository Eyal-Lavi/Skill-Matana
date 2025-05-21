const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database');
const User = require('./user');
const Skill = require('./skill');

const SkillUser = sequelize.define('SkillUser', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // autoIncrement: true,
        field:'user_id',
        // references: {
        //     model: User, 
        //     key: 'id'
        // },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    skillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // autoIncrement: true,
        field:'skill_id',
        // references: {
        //     model: Skill,
        //     key: 'id'
        // },
        onDelete: 'CASCADE',
        primaryKey: true
    },
}
    ,{
        tableName: 'skill_user',
        timestamps: false,
    }
);


module.exports = SkillUser;