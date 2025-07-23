
const Permission = require('./permission');
const Skill = require('./skill');
const SkillUser = require('./skillUser');
const Status = require('./status');
const User = require('./user');
const UserImage = require('./userImage');
const UserPermission = require('./userPermission');
const ImageType = require('./imageType.js');
const SkillStatus = require('./statusSkill.js');

const models = {
    Permission,
    Skill,
    SkillUser,
    Status,
    User,
    UserImage,
    UserPermission,
    ImageType,
    SkillStatus
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
    SkillStatus
}