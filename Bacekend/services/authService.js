const { Op } = require('sequelize');
const { User, PasswordResetToken, Skill, Connection } = require('../models');
const { Permission } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { UserImage } = require('../models');
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
            [Op.or]: {
                username: identifier,
                email: identifier,
            },
        },
        include: [
            {
                model: Permission,
                attributes: ['id', 'name'],
                // through:{attributes:[]}
            },
            {
                model: UserImage,
                attributes: ['url', 'typeId'],
                as: 'Images',
                // through:{attributes:[]}
            },
            {
                model: Skill,
                attributes: ['id', 'name'],
                where: {
                    status: {
                        [Op.eq]: 1
                    }
                },
                required: false,
                as: 'skills'
            },
            // Connections from both directions
            {
                model: User,
                as: 'connectionsA',
                attributes: ['id', 'firstName', 'lastName'],
                through: { attributes: [] },
                include: [{ model: UserImage, as: 'Images', attributes: ['url', 'typeId'] }],
                required: false,
            },
            {
                model: User,
                as: 'connectionsB',
                attributes: ['id', 'firstName', 'lastName'],
                through: { attributes: [] },
                include: [{ model: UserImage, as: 'Images', attributes: ['url', 'typeId'] }],
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

const findUserByUsernameOrEmail = async (identifier, transaction = null) => {
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


const createToken = async (userId) => {
    if (!userId) { throw new Error('UserId is requierd'); }

    const existToken = await checkIfActiveTokenExist(userId);
    if (existToken) {
        return existToken;
    }
    const token = await crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newToken = await PasswordResetToken.create({
        userId,
        token,
        expiresAt,
        used: false
    });

    return newToken;
}

const checkIfActiveTokenExist = async (userId = null, token = null) => {
    console.log(userId, token);

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

const sendEmailWithLinkReset = async (email, link) => {
    if (!email) throw new Error('Email is required');
    if (!link) throw new Error('Link is required');

    const subject = 'Password Reset Request 🔐';
    const html = `
      <!DOCTYPE html>
      <html dir="ltr" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
                      🔐 Password Reset Request
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #333; font-size: 18px; line-height: 1.6;">
                      Hello,
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                      You requested a password reset for your Skill Matana account. Click the button below to reset your password:
                    </p>
                    
                    <div style="margin-top: 40px; text-align: center;">
                      <a href="${link}" 
                         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                        Reset My Password
                      </a>
                    </div>
                    
                    <p style="margin: 40px 0 0 0; color: #999; font-size: 14px; text-align: center; line-height: 1.6;">
                      If you did not request this, please ignore this email. Your password will remain unchanged.
                    </p>
                    
                    <p style="margin: 20px 0 0 0; color: #999; font-size: 13px; text-align: center; line-height: 1.6;">
                      <strong>Security Tip:</strong> This link will expire in 15 minutes for your protection.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #999; font-size: 13px;">
                      © Skill Matana - Collaborative Learning Platform
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    return await sendEmail(email, subject, html);
}

const resetUserPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw new Error('Token & new Password is required');
    }
    const existToken = await checkIfActiveTokenExist(null, token);
    if (!existToken) {
        throw new Error('Invalid or expired token');
    }

    const user = await User.findByPk(existToken.userId);

    if (!user) {
        throw new Error('User not found');
    }

    await user.update({ password: newPassword });

    await existToken.update({ used: true });

    const subject = 'Password Reset Successful ✅';

    const html = `
      <!DOCTYPE html>
      <html dir="ltr" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
                      ✅ Password Reset Successful
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #333; font-size: 18px; line-height: 1.6;">
                      Hi <strong>${user.firstName || 'User'}</strong>,
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                      Your password has been successfully reset.
                    </p>
                    
                    <!-- Success Card -->
                    <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 30px 0;">
                      <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                        ✅ Your account is secure. You can now log in with your new password.
                      </p>
                    </div>
                    
                    <div style="margin-top: 40px; text-align: center;">
                      <a href="${process.env.CLIENT_URL}/auth/login" 
                         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                        Log In to Your Account
                      </a>
                    </div>
                    
                    <p style="margin: 40px 0 0 0; color: #999; font-size: 14px; text-align: center; line-height: 1.6;">
                      If you did not perform this action, please 
                      <a href="mailto:${process.env.SMTP_USER}?subject=Support Request&body=Hello, I need help with my account." style="color: #667eea; text-decoration: none;">
                        contact support immediately
                      </a>.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #999; font-size: 13px;">
                      © Skill Matana - Collaborative Learning Platform
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await sendEmail(user.email, subject, html);

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
