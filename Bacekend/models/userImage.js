const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./user');
const ImageType = require('./imageType');

const UserImage = sequelize.define('UserImage', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: User, 
            key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'url',
        primaryKey: true
    },
    typeId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        field:'type_id',
        references:{
            model:ImageType,
            key:'id'
        }
    }
}
    , {
        tableName: 'user_image',
        timestamps: false,
    }
);


module.exports = UserImage;