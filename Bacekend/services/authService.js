const {Op} = require('sequelize');
const {User} = require('../models');
const {Permission} = require('../models');

const bcrypt = require('bcrypt');
const {UserImage} = require('../models');

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
                attributes:['url'],
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

module.exports = {
    validateUserFields,
    ComperePasswords,
    findUserByUsernameOrEmailWithPermissions,
    findUserByUsernameOrEmail,
    createUser,
    updateUserById
};
