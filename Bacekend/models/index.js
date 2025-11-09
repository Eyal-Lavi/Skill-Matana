
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
const Availability = require('./availability.js');
const RecurringAvailability = require('./recurringAvailability.js');
const Meeting = require('./meeting.js');
const MeetingAlert = require('./meetingAlert.js');
const SystemNotification = require('./systemNotification.js');

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
    Availability,
    RecurringAvailability,
    Meeting,
    MeetingAlert,
    SystemNotification,
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
    Availability,
    RecurringAvailability,
    Meeting,
    MeetingAlert,
    SystemNotification,
}