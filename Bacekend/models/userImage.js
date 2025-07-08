const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./user');
// const User = require('./user');

const UserImage = sequelize.define('UserImage', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // autoIncrement: true,
        field: 'user_id',
        // references: {
        //     model: User, 
        //     key: 'id'
        // },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'url',
        primaryKey: true
    },
}
    , {
        tableName: 'user_image',
        timestamps: false,
        // associate: (models) => {
        //     UserImage.belongsTo(models.User, {
        //         foreignKey: 'userId',
        //         as: 'user'
        //     });
        // }
    }
);

// UserImage.belongsTo(User, {
//     foreignKey: 'userId',
//     as: 'user'
// });


// User.belongsToMany(UserImage, {  
//     foreignKey: 'userId', 
// });
// UserImage.hasOne(User, {  
//     foreignKey: 'id', 
// });

module.exports = UserImage;