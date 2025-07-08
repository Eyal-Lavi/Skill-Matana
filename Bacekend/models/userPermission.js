const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database');
// const User = require('./user');
// const Permission = require('./permission');
// const {User,Permission} = require('../models'); // Importing associate to ensure associations are set up
const UserPermission = sequelize.define('UserPermission', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull:false,
        // references: {
        //     model: User, 
        //     key: 'id'
        // },
        onDelete: 'CASCADE',
        primaryKey: true,
        field:"user_id",
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull:false,
        // references: {
        //     model: Permission,
        //     key: 'id'
        // },
        onDelete: 'CASCADE',
        primaryKey: true,
        field:"permission_id"
    }
}, {
    timestamps: false,
    tableName:"user_permission"
});

// // Define Many-to-Many Relationships
// User.belongsToMany(Permission, {  // User belongs to many permissions 
//     through: UserPermission ,//through UserPermission
//     foreignKey: 'userId' // in UserPermission the foreignKey that belongs to User is 'userId'
// });

// Permission.belongsToMany(User, { //Permission belongs to many users 
//     through: UserPermission,  // through UserPermission
//     foreignKey: 'permissionId'// in UserPermission the foreignKey that belongs to Permission is 'permissionId'
// });

module.exports = UserPermission;
