const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database.js');
const bcrypt = require('bcrypt');
const Skill = require('./skill.js');
const UserImage = require('./userImage.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id',
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        field: 'username',
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'email',
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password',
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'gender',
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },

},
    {
        timestamps: false,
        tableName: 'users',
        associate: (models) => {
            // User.belongsToMany(models.Skill, {
            //     through: models.SkillUser,
            //     foreignKey: 'userId',
            //     otherKey: 'skillId',
            //     as: 'skills'
            // });
            // User.hasOne(models.UserImage, {
            //     foreignKey: 'userId',
            //     as: 'image'
            // });
        },
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);

                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    }

);

// User.hasMany(UserImage, {
//     foreignKey: 'userId',
//     as: 'images'
// });
// User.belongsToMany(Skill,{
//     through: SkillUser,
//     foreignKey: 'userId',
//     otherKey: 'skillId',
//     as : 'users'
// });

module.exports = User;


