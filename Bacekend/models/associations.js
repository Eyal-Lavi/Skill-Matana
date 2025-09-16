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
    PasswordResetToken,
    Connection,
    Availability,
    Meeting,
    MeetingAlert
  } = models;

  User.hasMany(UserImage, {
    foreignKey: "userId",
    as: "Images",
  });
  UserImage.belongsTo(User, {
    foreignKey: "userId",
    // as: 'user',
  });

  User.belongsToMany(Skill, {
    through: SkillUser,
    foreignKey: "userId",
    otherKey: "skillId",
    as: "skills",
  });
  Skill.belongsToMany(User, {
    through: SkillUser,
    foreignKey: "skillId",
    otherKey: "userId",
    as: "users",
  });

  // Define Many-to-Many Relationships
  User.belongsToMany(Permission, {
    // User belongs to many permissions
    through: UserPermission, //through UserPermission
    foreignKey: "userId", // in UserPermission the foreignKey that belongs to User is 'userId'
  });

  Permission.belongsToMany(User, {
    //Permission belongs to many users
    through: UserPermission, // through UserPermission
    foreignKey: "permissionId", // in UserPermission the foreignKey that belongs to Permission is 'permissionId'
  });

  User.belongsTo(Status, {
    foreignKey: "status",
    // as: 'statusInfo',
  });

  UserImage.belongsTo(ImageType, {
    foreignKey: "typeId",
    as: "type",
  });

  ImageType.hasMany(UserImage, {
    foreignKey: "typeId",
    as: "Images",
  });

  User.hasMany(models.SkillRequest, {
    foreignKey: "requestedBy",
    as: "skillRequests",
  });

  SkillRequest.belongsTo(User, {
    foreignKey: "requestedBy",
    as: "requester",
  });
  User.hasMany(ContactRequest, {
    foreignKey: { name: "requestedBy", allowNull: false },
    as: "contactRequests", 
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ContactRequest.belongsTo(User, {
    foreignKey: { name: "requestedBy", allowNull: false },
    as: "requester",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(ContactRequest, {
    foreignKey: { name: "requestedTo", allowNull: false },
    as: "incomingContactRequests",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ContactRequest.belongsTo(User, {
    foreignKey: { name: "requestedTo", allowNull: false },
    as: "recipient",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  PasswordResetToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  User.hasMany(PasswordResetToken, {
    foreignKey: "userId",
    as: "resetToken",
  });

  // Connections: symmetric user-to-user relationship via Connection table
  Connection.belongsTo(User, { foreignKey: 'userA', as: 'userAInfo' });
  Connection.belongsTo(User, { foreignKey: 'userB', as: 'userBInfo' });

  User.belongsToMany(User, {
    through: Connection,
    as: 'connectionsA',
    foreignKey: 'userA',
    otherKey: 'userB',
  });

  User.belongsToMany(User, {
    through: Connection,
    as: 'connectionsB',
    foreignKey: 'userB',
    otherKey: 'userA',
  });

  Availability.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
  User.hasMany(Availability, { foreignKey: 'userId', as: 'availabilities' });


  Meeting.belongsTo(User, { foreignKey: 'hostId', as: 'host' });
  Meeting.belongsTo(User, { foreignKey: 'guestId', as: 'guest' });

  Meeting.belongsTo(Availability, { foreignKey: 'availabilityId', as: 'availability' });
  Availability.hasOne(Meeting, { foreignKey: 'availabilityId', as: 'meeting' });

  MeetingAlert.belongsTo(User, { foreignKey: 'watcherId', as: 'watcher' });
  MeetingAlert.belongsTo(User, { foreignKey: 'targetUserId', as: 'targetUser' });
};
