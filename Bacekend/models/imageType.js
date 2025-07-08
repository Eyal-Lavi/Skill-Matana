const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database')

const ImageType = sequelize.define('ImageType',{
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
    tableName: 'image_type',
});

module.exports = ImageType;