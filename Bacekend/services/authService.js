const { Op } = require('sequelize');
const { User, PasswordResetToken, Skill, Connection, PendingRegistration } = require('../models');
const { Permission } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { UserImage } = require('../models');
const { sendEmail } = require('./emailService');

// Generate 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create or update pending registration
const createPendingRegistration = async (userData, transaction = null) => {
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing pending registration for this email
    await PendingRegistration.destroy({
        where: { email: userData.email },
        transaction
    });

    const pending = await PendingRegistration.create({
        email: userData.email,
        username: userData.username,
        password: userData.password, // Will be hashed by the hook
        firstName: userData.firstname,
        lastName: userData.lastname,
        gender: userData.gender,
        verificationCode: code,
        expiresAt,
        verified: false
    }, { transaction });

    return { pending, code };
};

// Verify the code and return the pending registration
const verifyRegistrationCode = async (email, code, transaction = null) => {
    const pending = await PendingRegistration.findOne({
        where: {
            email,
            verificationCode: code,
            verified: false,
            expiresAt: { [Op.gt]: new Date() }
        },
        transaction
    });

    return pending;
};

// Send verification email with code
const sendVerificationEmail = async (email, code, firstName) => {
    const subject = 'Verify Your Email - Skill Matana ✨';
    const html = `
      <!DOCTYPE html>
      <html dir="ltr" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f23;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(145deg, rgba(30, 30, 60, 0.9) 0%, rgba(20, 20, 45, 0.95) 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 80px rgba(99, 102, 241, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.2);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%); padding: 50px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      Verify Your Email
                    </h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                      One step away from joining Skill Matana
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 50px 40px;">
                    <p style="margin: 0 0 25px 0; color: #e2e8f0; font-size: 18px; line-height: 1.6;">
                      Hi <strong style="color: #a5b4fc;">${firstName || 'there'}</strong>,
                    </p>
                    <p style="margin: 0 0 35px 0; color: #94a3b8; font-size: 16px; line-height: 1.7;">
                      Enter this verification code to complete your registration:
                    </p>
                    
                    <!-- Code Box -->
                    <div style="text-align: center; margin: 40px 0;">
                      <div style="display: inline-block; background: linear-gradient(145deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid rgba(99, 102, 241, 0.4); border-radius: 16px; padding: 30px 50px; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2);">
                        <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
                          Verification Code
                        </p>
                        <p style="margin: 0; font-size: 42px; font-weight: 700; letter-spacing: 12px; background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                          ${code}
                        </p>
                      </div>
                    </div>
                    
                    <!-- Timer Warning -->
                    <div style="text-align: center; margin: 30px 0;">
                      <div style="display: inline-flex; align-items: center; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 12px 24px;">
                        <span style="color: #fbbf24; font-size: 16px; margin-right: 8px;">⏱️</span>
                        <span style="color: #fbbf24; font-size: 14px; font-weight: 500;">This code expires in 10 minutes</span>
                      </div>
                    </div>
                    
                    <p style="margin: 40px 0 0 0; color: #64748b; font-size: 14px; text-align: center; line-height: 1.6;">
                      If you didn't request this code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: rgba(15, 15, 35, 0.5); padding: 30px; text-align: center; border-top: 1px solid rgba(99, 102, 241, 0.2);">
                    <p style="margin: 0; color: #64748b; font-size: 13px;">
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
};

// Clean up expired pending registrations
const cleanupExpiredPendingRegistrations = async () => {
    await PendingRegistration.destroy({
        where: {
            expiresAt: { [Op.lt]: new Date() }
        }
    });
};

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
            
            },
            {
                model: UserImage,
                attributes: ['url', 'typeId'],
                as: 'Images',
              
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
    resetUserPassword,
    generateVerificationCode,
    createPendingRegistration,
    verifyRegistrationCode,
    sendVerificationEmail,
    cleanupExpiredPendingRegistrations
};
