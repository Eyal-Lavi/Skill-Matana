const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database')

const ContactRequest = sequelize.define('ContactRequest',{
    id:{
        allowNull:false,
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    message:{
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
    tableName: 'contact_requests',
});

module.exports = ContactRequest;