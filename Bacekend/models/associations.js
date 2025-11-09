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
    RecurringAvailability,
    Meeting,
    MeetingAlert,
    SystemNotification
  } = models;

  User.hasMany(UserImage, {
    foreignKey: "userId",
    as: "Images",
  });
  UserImage.belongsTo(User, {
    foreignKey: "userId",
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


  User.belongsToMany(Permission, {
  
    through: UserPermission, 
    foreignKey: "userId", 
  });

  Permission.belongsToMany(User, {
   
    through: UserPermission, 
    foreignKey: "permissionId", 
  });

  User.belongsTo(Status, {
    foreignKey: "status",
    
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

  RecurringAvailability.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
  User.hasMany(RecurringAvailability, { foreignKey: 'userId', as: 'recurringAvailabilities' });


  Meeting.belongsTo(User, { foreignKey: 'hostId', as: 'host' });
  Meeting.belongsTo(User, { foreignKey: 'guestId', as: 'guest' });

  Meeting.belongsTo(Availability, { foreignKey: 'availabilityId', as: 'availability' });
  Availability.hasOne(Meeting, { foreignKey: 'availabilityId', as: 'meeting' });

  MeetingAlert.belongsTo(User, { foreignKey: 'watcherId', as: 'watcher' });
  MeetingAlert.belongsTo(User, { foreignKey: 'targetUserId', as: 'targetUser' });

  SystemNotification.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  User.hasMany(SystemNotification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
};
