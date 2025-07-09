const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const UserImage = sequelize.define('UserImage', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
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
            model:'image_type',
            key:'id'
        }
    }
}
    , {
        tableName: 'user_image',
        timestamps: false,
        indexes:[{
            unique:true,
            fields:['user_id' , 'type_id']
        }]
    }
);


module.exports = UserImage;