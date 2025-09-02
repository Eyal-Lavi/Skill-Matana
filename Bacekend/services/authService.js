const {Op} = require('sequelize');
const {User, PasswordResetToken} = require('../models');
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

const findUserByUsernameOrEmail = async (identifier, transaction) => {
    if (!identifier) throw new Error("Username or email is required");
    if (!transaction) throw new Error("Transaction is required");

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

const checkIfActiveTokenExist = async(userId) => {
    if(!userId) {throw new Error('user id is required');}
    
    const existToken = await PasswordResetToken.findOne({where:{
        userId:userId,
        used:false,
        expiresAt:{[Op.gt]: new Date()}
    }});
    return existToken;
}

const sendEmailWithLinkReset = async(email , link) => {
    if(!email) {throw new Error('Email is required');}

    


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
    sendEmailWithLinkReset
};
