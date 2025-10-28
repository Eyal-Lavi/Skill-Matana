const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database');

const UserPermission = sequelize.define('UserPermission', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull:false,
      
        onDelete: 'CASCADE',
        primaryKey: true,
        field:"user_id",
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull:false,
  
        onDelete: 'CASCADE',
        primaryKey: true,
        field:"permission_id"
    }
}, {
    timestamps: false,
    tableName:"user_permission"
});

module.exports = UserPermission;
