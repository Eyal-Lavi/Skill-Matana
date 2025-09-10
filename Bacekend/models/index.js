
const Permission = require('./permission');
const Skill = require('./skill');
const SkillUser = require('./skillUser');
const Status = require('./status');
const User = require('./user');
const UserImage = require('./userImage');
const UserPermission = require('./userPermission');
const ImageType = require('./imageType.js');
const SkillRequest = require('./skillRequests.js');
const ContactRequest = require('./contactRequests.js');
const PasswordResetToken = require('./passwordResetToken.js');
const Connection = require('./connection.js');

const models = {
    Permission,
    Skill,
    SkillUser,
    Status,
    User,
    UserImage,
    UserPermission,
    ImageType,
    SkillRequest,
    ContactRequest,
    PasswordResetToken,
    Connection,
};

require('./associations.js')(models);

module.exports ={
    Permission,
    Skill,
    SkillUser,
    Status,
    User,
    UserImage,
    UserPermission,
    ImageType,
    SkillRequest,
    ContactRequest,
    PasswordResetToken,
    Connection,
}