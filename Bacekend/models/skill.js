const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database');
const User = require('./user')
const SkillUser = require('./skillUser')
const Skill = sequelize.define('Skill', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name',
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1,
    },
        }
    ,{
        timestamps: false,
        tableName: 'skills',
        associate: (models) => {
            Skill.belongsToMany(models.User, {
                through: models.SkillUser,
                foreignKey: 'skillId',
                otherKey: 'userId',
                as: 'users'
            });
        }
    }
);

// Skill.belongsToMany(User, {
//     through: SkillUser,
//     foreignKey: 'skillId',
//     otherKey: 'userId',
//     as: 'skills'
// });

module.exports = Skill;