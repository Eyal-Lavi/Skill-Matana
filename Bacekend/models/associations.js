module.exports = (models) => {
    const {
        User,
        UserImage,
        Skill,
        SkillUser,
        Permission,
        UserPermission,
        Status,
    } = models;

    User.hasMany(UserImage, {
        foreignKey: 'userId',
        as: 'Images',
    });
    UserImage.belongsTo(User, {
        foreignKey: 'userId',
        // as: 'user',
    });

    User.belongsToMany(Skill, {
        through: SkillUser,
        foreignKey: 'userId',
        otherKey: 'skillId',
        // as: 'skills',
    });
    Skill.belongsToMany(User, {
        through: SkillUser,
        foreignKey: 'skillId',
        otherKey: 'userId',
        // as: 'users',
    });

    // Define Many-to-Many Relationships
    User.belongsToMany(Permission, {  // User belongs to many permissions 
        through: UserPermission,//through UserPermission
        foreignKey: 'userId' // in UserPermission the foreignKey that belongs to User is 'userId'
    });

    Permission.belongsToMany(User, { //Permission belongs to many users 
        through: UserPermission,  // through UserPermission
        foreignKey: 'permissionId'// in UserPermission the foreignKey that belongs to Permission is 'permissionId'
    });

    // 4. User -> Status (סטטוס של המשתמש)
    User.belongsTo(Status, {
        foreignKey: 'status',
        // as: 'statusInfo',
    });
};
