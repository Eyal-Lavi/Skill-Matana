const {Op} = require('sequelize');
const {User, PasswordResetToken, Skill, Connection} = require('../models');
const {Permission} = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {UserImage} = require('../models');
const { sendEmail } = require('./emailService');

const validateUserFields = (user) => {
    const required = ['username', 'email', 'password', 'firstname', 'lastname', 'gender'];
    for (const field of required) {
        if (!user[field]) return field;
    }
    return null;
};

const ComperePasswords = async (password, hashedPassword) => {
    const isMatchPassword = await bcrypt.compare(password, hashedPassword);
    return isMatchPassword;
}

const findUserByUsernameOrEmailWithPermissions = async (identifier, transaction) => {
    if (!identifier) throw new Error("Username or email is required");
    if (!transaction) throw new Error("Transaction is required");
    
    const user = await User.findOne({
        where: {
            [Op.or]:{
                username: identifier,
                email: identifier,
            },
        },
        include:[
            {
                model:Permission,
                attributes:['id' , 'name'],
                // through:{attributes:[]}
            },
            {
                model:UserImage,
                attributes:['url','typeId'],
                as: 'Images',
                // through:{attributes:[]}
            },
            {
                model:Skill,
                attributes:['id' , 'name'],
                where:{
                    status:{
                        [Op.eq]:1
                    }
                },
                required:false,
                as:'skills'
            },
            // Connections from both directions
            {
                model: User,
                as: 'connectionsA',
                attributes: ['id','firstName','lastName'],
                through: { attributes: [] },
                include: [{ model: UserImage, as: 'Images', attributes: ['url','typeId'] }],
                required: false,
            },
            {
                model: User,
                as: 'connectionsB',
                attributes: ['id','firstName','lastName'],
                through: { attributes: [] },
                include: [{ model: UserImage, as: 'Images', attributes: ['url','typeId'] }],
                required: false,
            }
        ],
        transaction
    });

    return user;
}

const updateUserById = async (userId, updates, transaction) => {
    if (!transaction) throw new Error("Transaction is required");

    const user = await User.findByPk(userId, { transaction });

    if (!user) {
        throw new Error("User not found");
    }

    // רק העדכון הרלוונטי לשדות המותרים
    const allowedFields = ['firstName', 'lastName', 'email', 'gender'];
    
    for (const field of allowedFields) {
        if (updates[field] !== undefined) {
            user[field] = updates[field];
        }
    }

    await user.save({ transaction });
    return user;
};

const findUserByUsernameOrEmail = async (identifier, transaction=null) => {
    if (!identifier) throw new Error("Username or email is required");

    const user = await User.findOne({
        where: {
            [Op.or]: [
                { username: identifier },
                { email: identifier }
            ]
        },
        transaction
    });

    return user;
};


const createUser = async (user, transaction) => {
    if (!transaction) throw new Error("Transaction is required");

    const missing = validateUserFields(user);
    if (missing) throw new Error(`${missing} is required`);

    await User.create({
        username: user.username,
        email: user.email,
        password: user.password,
        firstName: user.firstname,
        lastName: user.lastname,
        gender: user.gender,
    }, { transaction });

    return {
        status: 200,
        message: "User created successfully"
    };
};


const createToken = async(userId) => {
    if(!userId){throw new Error('UserId is requierd');}

    const existToken = await checkIfActiveTokenExist(userId);
    if(existToken){
        return existToken;
    }
    const token = await crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newToken = await PasswordResetToken.create({
        userId,
        token,
        expiresAt,
        used:false
    });

    return newToken;
}

const checkIfActiveTokenExist = async (userId=null, token=null) => {
    console.log(userId , token);
    
    if (!userId && !token) {
        throw new Error("either userId or token is required");
    }

    const whereClause = {
        used: false,
        expiresAt: { [Op.gt]: new Date() }
    };

    if (userId) {
        whereClause.userId = userId;
    }

    if (token) {
        whereClause.token = token;
    }

    return await PasswordResetToken.findOne({ where: whereClause });
};

const sendEmailWithLinkReset = async(email , link) => {
    if (!email) throw new Error('Email is required');
    if (!link) throw new Error('Link is required');

    const subject = 'Password Reset Request';
    const html = `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${link}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    return await sendEmail(email, subject, html);
}

const resetUserPassword = async (token , newPassword) => {
    if (!token || !newPassword){
        throw new Error('Token & new Password is required');
    }
    const existToken = await checkIfActiveTokenExist(null , token);
    if(!existToken){
        throw new Error('Invalid or expired token');
    }

    const user = await User.findByPk(existToken.userId);

    if(!user){
        throw new Error('User not found');
    }

    await user.update({password:newPassword});

    await existToken.update({used:true});

    const subject = 'Your Password Has Been Reset Successfully';

    const html =
     `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
         <h2>Password Reset Confirmation</h2>
         <p>Hi ${user.firstname},</p>
         <p>Your password has been successfully reset.</p>
         <p>If you did not perform this action, please 
        <a href="mailto:${process.env.SMTP_USER}?subject=Support Request&body=Hello, I need help with my account.">
            contact support immediately
        </a>.
    </p>
    <p>You can now <a href="${process.env.CLIENT_URL}/auth/login">log in</a> with your new password.</p>
    <br>
    <p>Thank you,<br>The SkillMatana Team</p>
    </div>`

    await sendEmail(user.email , subject , html);
    
    return true;
}
module.exports = {
    validateUserFields,
    ComperePasswords,
    findUserByUsernameOrEmailWithPermissions,
    findUserByUsernameOrEmail,
    createUser,
    updateUserById,
    createToken,
    checkIfActiveTokenExist,
    sendEmailWithLinkReset,
    resetUserPassword
};
