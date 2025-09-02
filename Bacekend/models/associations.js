module.exports = (models) => {
    const {
        User,
        UserImage,
        Skill,
        SkillUser,
        Permission,
        UserPermission,
        Status,
        ImageType,
        SkillRequest,
        ContactRequest,
        PasswordResetToken
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

    User.belongsTo(Status, {
        foreignKey: 'status',
        // as: 'statusInfo',
    });

    UserImage.belongsTo(ImageType , {
        foreignKey:'typeId',
        as:'type'
    });

    ImageType.hasMany(UserImage , {
        foreignKey:'typeId',
        as:'Images'
    });

    User.hasMany(models.SkillRequest, {
        foreignKey: 'requestedBy',
        as: 'skillRequests',
    });

    SkillRequest.belongsTo(User, {
        foreignKey: 'requestedBy',
        as: 'requester',
    });

    User.hasMany(models.ContactRequest, {
        foreignKey: 'requestedBy',
        as: 'contactRequests',
    });

    ContactRequest.belongsTo(User, {
        foreignKey: 'requestedBy',
        as: 'requester',
    });

    User.hasMany(models.ContactRequest, {
        foreignKey: 'requestedTo',
        as: 'incomingContactRequests',
    });
    
    ContactRequest.belongsTo(User, {
        foreignKey: 'requestedTo',
        as: 'recipient',
    });

    PasswordResetToken.belongsTo(User , {
        foreignKey:'userId',
        as:'user'
    });

    User.hasMany(PasswordResetToken , {
        foreignKey:'userId',
        as:'resetToken'
    });
};
