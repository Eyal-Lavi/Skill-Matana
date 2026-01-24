const sequelize = require('../utils/database');
const { Op } = require('sequelize');
const { addUserPermission } = require('../services/permissionService');
const {uploadBase64Image} = require('../services/uploadService')
const { 
        findUserByUsernameOrEmail,
        validateUserFields,
        ComperePasswords,
        createUser,
        findUserByUsernameOrEmailWithPermissions,
        updateUserById,
        checkIfActiveTokenExist,
        createToken,
        sendEmailWithLinkReset,
        resetUserPassword,
        createPendingRegistration,
        verifyRegistrationCode,
        sendVerificationEmail
     } = require('../services/authService');
const { User, Permission, Skill, UserImage } = require('../models');

const updateUserProfile = async (req, res) => {
  const { id, firstname, lastname, email, gender, profileImage } = req.body;

  if (!id || !firstname || !lastname || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const transaction = await sequelize.sequelize.transaction();

  try {
    const updatedUser = await updateUserById(id, {
      firstName: firstname,
      lastName: lastname,
      email,
      gender,
    }, transaction);

    
    if (profileImage) {
      const result = await uploadBase64Image(profileImage, `${id}_profile`);
      await UserImage.upsert({
        userId: id,
        url: result.url,
        typeId: 1, 
      }, { transaction });
    }

    console.log("Here 1");
    
    await transaction.commit();
    console.log("Here 2");

    // Re-fetch the user with the same relations as login,
    // so the frontend always receives a full, consistent user payload.
    const freshUser = await User.findByPk(id, {
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
              [Op.eq]: 1,
            },
          },
          required: false,
          as: 'skills',
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
        },
      ],
    });

    if (!freshUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const permissions = Array.isArray(freshUser.Permissions)
      ? freshUser.Permissions.map((p) => ({ id: p.id, name: p.name }))
      : [];

    const imgs = Array.isArray(freshUser.Images) ? freshUser.Images : [];
    const profileImg = imgs.find((img) => img.typeId === 1);
    const bannerImg = imgs.find((img) => img.typeId === 2);

    const skills = Array.isArray(freshUser.skills)
      ? freshUser.skills.map((s) => ({ id: s.id, name: s.name }))
      : [];

    const mapConn = (u) => {
      const uImgs = Array.isArray(u.Images) ? u.Images : [];
      const prof = uImgs.find((img) => img.typeId === 1);
      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        profilePicture: prof?.url || null,
      };
    };

    const connsA = Array.isArray(freshUser.connectionsA) ? freshUser.connectionsA.map(mapConn) : [];
    const connsB = Array.isArray(freshUser.connectionsB) ? freshUser.connectionsB.map(mapConn) : [];
    const connectionsMap = new Map();
    [...connsA, ...connsB].forEach((c) => {
      if (!connectionsMap.has(c.id)) connectionsMap.set(c.id, c);
    });
    const connections = Array.from(connectionsMap.values());

    const sessionUserPayload = {
      id: freshUser.id,
      username: freshUser.username,
      firstName: freshUser.firstName,
      lastName: freshUser.lastName,
      email: freshUser.email,
      gender: freshUser.gender,
      permissions,
      profilePicture: profileImg?.url || null,
      bannerPicture: bannerImg?.url || null,
      skills,
      connections,
    };

    if (req.session?.user?.id === sessionUserPayload.id) {
      req.session.user = sessionUserPayload;
      req.session.isAdmin = permissions.some((p) => p.id === 99);

      await new Promise((resolve, reject) => {
        req.session.save((err) => (err ? reject(err) : resolve()));
      });
    }

    console.log("Here 5");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: sessionUserPayload,
    });

  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSession = async (req, res, next) => {
  try {
    if (!req.session?.isLoggedIn || !req.session?.user?.id) {
      return res.status(200).json({ isAuthenticated: false });
    }

    const userId = req.session.user.id;

    // Always re-fetch current user data so refresh reflects latest DB state
    // (skills, permissions, connections, images, etc.).
    const freshUser = await User.findByPk(userId, {
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
              [Op.eq]: 1,
            },
          },
          required: false,
          as: 'skills',
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
        },
      ],
    });

    if (!freshUser) {
      // User no longer exists → treat as logged out.
      return res.status(200).json({ isAuthenticated: false });
    }

    const permissions = Array.isArray(freshUser.Permissions)
      ? freshUser.Permissions.map((p) => ({ id: p.id, name: p.name }))
      : [];

    const imgs = Array.isArray(freshUser.Images) ? freshUser.Images : [];
    const profileImg = imgs.find((img) => img.typeId === 1);
    const bannerImg = imgs.find((img) => img.typeId === 2);

    const skills = Array.isArray(freshUser.skills)
      ? freshUser.skills.map((s) => ({ id: s.id, name: s.name }))
      : [];

    const mapConn = (u) => {
      const uImgs = Array.isArray(u.Images) ? u.Images : [];
      const prof = uImgs.find((img) => img.typeId === 1);
      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        profilePicture: prof?.url || null,
      };
    };

    const connsA = Array.isArray(freshUser.connectionsA) ? freshUser.connectionsA.map(mapConn) : [];
    const connsB = Array.isArray(freshUser.connectionsB) ? freshUser.connectionsB.map(mapConn) : [];
    const connectionsMap = new Map();
    [...connsA, ...connsB].forEach((c) => {
      if (!connectionsMap.has(c.id)) connectionsMap.set(c.id, c);
    });
    const connections = Array.from(connectionsMap.values());

    const sessionUserPayload = {
      id: freshUser.id,
      username: freshUser.username,
      firstName: freshUser.firstName,
      lastName: freshUser.lastName,
      email: freshUser.email,
      gender: freshUser.gender,
      permissions,
      profilePicture: profileImg?.url || null,
      bannerPicture: bannerImg?.url || null,
      skills,
      connections,
    };

    req.session.user = sessionUserPayload;
    req.session.isAdmin = permissions.some((p) => p.id === 99);

    await new Promise((resolve, reject) => {
      req.session.save((err) => (err ? reject(err) : resolve()));
    });

    return res.status(200).json({
      isAuthenticated: true,
      user: sessionUserPayload,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return next({ status: 500, message: "Internal server error" });
  }
};

const logout = async (request, response, next) => {
    try {
        console.log('request.session');
        console.log(request.session);
        
        if(!request.session.isLoggedIn) {
            return response.status(401).json({ message: "You are not logged in" });
        }
        request.session.destroy((err) => {
            if (err) {
                console.error("Session destruction error:", err);
                return response.status(500).json({ message: "Internal server error" });
            }
            response.clearCookie('connect.sid'); 
            response.status(200).json({ message: "Logged out successfully" });
        });

        

    } catch (e) {
        console.error(e);
        response.status(500).json({ message: "Internal server error" });
    }
}
const login = async (request, response, next) => {
  try {
    const user = request.body;
    const transaction = await sequelize.sequelize.transaction();

    const existUser = await findUserByUsernameOrEmailWithPermissions(user.usernameOrEmail, transaction);

    if (!existUser) {
      return response.status(401).json({ message: "Invalid username or email" });
    }

    const isMatchPassword = await ComperePasswords(user.password, existUser.password);
    if (!isMatchPassword) {
      return response.status(401).json({ message: "Invalid username or password" });
    }

    const permissions = existUser.Permissions.map(permission => ({
      id: permission.id,
      name: permission.name
    }));
    console.log(existUser);

    const profileImg = existUser.Images.find(img => img.typeId === 1);
    const bannerImg = existUser.Images.find(img => img.typeId === 2);
    
    const skills = existUser.skills.map(skill => ({
      id:skill.id,
      name:skill.name
    }));

    
    const mapConn = (u) => {
      const imgs = Array.isArray(u.Images) ? u.Images : [];
      const prof = imgs.find(img => img.typeId === 1);
      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        profilePicture: prof?.url || null,
      };
    };
    const connsA = Array.isArray(existUser.connectionsA) ? existUser.connectionsA.map(mapConn) : [];
    const connsB = Array.isArray(existUser.connectionsB) ? existUser.connectionsB.map(mapConn) : [];
    const connectionsMap = new Map();
    [...connsA, ...connsB].forEach(c => { if (!connectionsMap.has(c.id)) connectionsMap.set(c.id, c); });
    const connections = Array.from(connectionsMap.values());
    

    request.session.isLoggedIn = true;
    request.session.isAdmin = permissions.some(p => p.id === 99);
    request.session.user = {
      id: existUser.id,
      username: existUser.username,
      firstName: existUser.firstName,
      lastName: existUser.lastName,
      email: existUser.email,
      gender: existUser.gender,
      permissions,
      profilePicture: profileImg?.url || null,
      bannerPicture: bannerImg?.url || null,
      skills,
      connections
    };
    

    await new Promise((resolve, reject) => {
      request.session.save(err => (err ? reject(err) : resolve()));
    });

    response.status(200).json({
      message: "Login successful",
      user: request.session.user
    });

  } catch (e) {
    console.error("Login error:", e);
    next({ message: e.message });
  }
};

const register = async (request, response, next) => {
    const transaction = await sequelize.sequelize.transaction();
  
    try {
      const user = request.body;
  
      const missingField = validateUserFields(user);
      if (missingField) {
        await transaction.rollback();
        return response.status(400).json({
          errors: [
            {
              type: "field",
              field: missingField.toLowerCase(),
              message: `${missingField} is required`
            }
          ]
        });
      }
  
      const userByUsername = await findUserByUsernameOrEmail(user.username, transaction);
      const userByEmail = await findUserByUsernameOrEmail(user.email, transaction);
  
      const errors = [];
  
      if (userByUsername) {
        errors.push({
          type: "field",
          field: "username",
          message: "Username already exists"
        });
      }
  
      if (userByEmail) {
        errors.push({
          type: "field",
          field: "email",
          message: "Email already exists"
        });
      }
  
      if (errors.length > 0) {
        await transaction.rollback();
        return response.status(400).json({ errors });
      }
  
      await createUser(user, transaction);
  
      const newUser = await findUserByUsernameOrEmail(user.username, transaction);
      if (!newUser) {
        await transaction.rollback();
        return response.status(500).json({
          errors: [
            {
              type: "global",
              field: "general",
              message: "User not found after creation"
            }
          ]
        });
      }

      await addUserPermission(newUser.id, 1, transaction);
  
      await transaction.commit();
      return response.status(201).json({ info: "Register confirmed" });
  
    } catch (e) {
      console.error("Register error:", e);
      await transaction.rollback();
  
      return response.status(500).json({
        errors: [
          {
            type: "global",
            field: "general",
            message: "Internal server error"
          }
        ]
      });
    }
  };



const sendPasswordResetLink = async(request, response, next) => {
  const { email } = request.body;
  if(!email){
    return response.status(400).json({message:'Email is required'});
  }
  try{
    const user = await findUserByUsernameOrEmail(email);
    if(!user){
      return response.status(409).json({message:'User not found'});
    }
    console.log(user.id);
    
    const exsitsToken = await checkIfActiveTokenExist(user.id);
    let token = exsitsToken ?  exsitsToken.token : (await createToken(user.id)).token;
    
    const link = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;
    await sendEmailWithLinkReset(email , link);
  
    return response.status(200).json({message:'Check your inbox'});
  }catch(e){
    response.status(500).json({message:e.message});
  }
}
  
const chekPasswordResetLink = async(request , response , next) => {
  const {token} = request.body;
  try{
    const exsitsToken = await checkIfActiveTokenExist(null,token);

    if(!exsitsToken){
      return response.status(401).json({message:'Unauthoriez user'});
    }

    response.status(200).json({message:'This user has active reset link'});
  }catch(error){
    response.status(500).json({message:e.message});
  }
}

const resetPassword = async(request , response , next) => {
  const {token , newPassword} = request.body;
  if(!newPassword){
    return response.status(400).json({message:'New password is required'});
  }
  try{
    const result = await resetUserPassword(token , newPassword);
    response.status(200).json({message:'Password update successfuly'});
  }catch(error){
    response.status(500).json({message:error.message});
  }
}

// Send verification code for registration
const sendVerificationCode = async (request, response, next) => {
  const transaction = await sequelize.sequelize.transaction();

  try {
    const user = request.body;
    console.log(user);
    // Validate required fields
    const missingField = validateUserFields(user);
    if (missingField) {
      await transaction.rollback();
      return response.status(400).json({
        errors: [{
          type: "field",
          field: missingField.toLowerCase(),
          message: `${missingField} is required`
        }]
      });
    }

    console.log(user);

    // Check if username or email already exists
    const userByUsername = await findUserByUsernameOrEmail(user.username, transaction);
    const userByEmail = await findUserByUsernameOrEmail(user.email, transaction);

    const errors = [];

    if (userByUsername) {
      errors.push({
        type: "field",
        field: "username",
        message: "Username already exists"
      });
    }

    if (userByEmail) {
      errors.push({
        type: "field",
        field: "email",
        message: "Email already exists"
      });
    }

    if (errors.length > 0) {
      await transaction.rollback();
      return response.status(400).json({ errors });
    }

    // Create pending registration with verification code
    const { pending, code } = await createPendingRegistration(user, transaction);

    // Send verification email
    await sendVerificationEmail(user.email, code, user.firstname);

    await transaction.commit();
    
    return response.status(200).json({ 
      message: "Verification code sent to your email",
      email: user.email
    });

  } catch (e) {
    console.error("Send verification error:", e);
    if (!transaction.finished) {
      await transaction.rollback();
    }
    return response.status(500).json({
      errors: [{
        type: "global",
        field: "general",
        message: "Failed to send verification code"
      }]
    });
  }
};

// Verify code and complete registration
const verifyCodeAndRegister = async (request, response, next) => {
  const transaction = await sequelize.sequelize.transaction();

  try {
    const { email, code } = request.body;

    if (!email || !code) {
      await transaction.rollback();
      return response.status(400).json({
        errors: [{
          type: "global",
          field: "general",
          message: "Email and verification code are required"
        }]
      });
    }

    // Verify the code
    const pending = await verifyRegistrationCode(email, code, transaction);

    if (!pending) {
      await transaction.rollback();
      return response.status(400).json({
        errors: [{
          type: "field",
          field: "code",
          message: "Invalid or expired verification code"
        }]
      });
    }

    // Check again if user exists (race condition / other registration flows)
    // Important: check BOTH email and username, because `User.username` is unique.
    const existingUserByEmail = await findUserByUsernameOrEmail(pending.email, transaction);
    const existingUserByUsername = await findUserByUsernameOrEmail(pending.username, transaction);

    if (existingUserByEmail || existingUserByUsername) {
      const errors = [];
      if (existingUserByUsername) {
        errors.push({
          type: "field",
          field: "username",
          message: "Username already exists"
        });
      }
      if (existingUserByEmail) {
        errors.push({
          type: "field",
          field: "email",
          message: "Email already exists"
        });
      }

      await transaction.rollback();
      return response.status(400).json({
        errors
      });
    }

    // Create the actual user (password is already hashed in pending)
    await User.create({
      username: pending.username,
      email: pending.email,
      password: pending.password, // Already hashed
      firstName: pending.firstName,
      lastName: pending.lastName,
      gender: pending.gender
    }, { 
      transaction,
      hooks: false // Skip the password hashing hook since it's already hashed
    });

    // Get the newly created user
    const newUser = await findUserByUsernameOrEmail(pending.username, transaction);
    if (!newUser) {
      await transaction.rollback();
      return response.status(500).json({
        errors: [{
          type: "global",
          field: "general",
          message: "User not found after creation"
        }]
      });
    }

    // Add default permission
    await addUserPermission(newUser.id, 1, transaction);

    // Mark pending registration as verified and delete it
    await pending.destroy({ transaction });

    await transaction.commit();
    return response.status(201).json({ 
      message: "Registration completed successfully",
      info: "Register confirmed" 
    });

  } catch (e) {
    console.error("Verify code error:", e);
    if (!transaction.finished) {
      await transaction.rollback();
    }

    // If we hit a DB constraint (e.g. username unique) return a clean client error
    if (e?.name === 'SequelizeUniqueConstraintError') {
      return response.status(400).json({
        errors: [{
          type: "global",
          field: "general",
          message: "User already exists"
        }]
      });
    }

    return response.status(500).json({
      errors: [{
        type: "global",
        field: "general",
        message: "Failed to complete registration"
      }]
    });
  }
};

// Resend verification code
const resendVerificationCode = async (request, response, next) => {
  const transaction = await sequelize.sequelize.transaction();

  try {
    const { email, username, password, firstname, lastname, gender } = request.body;

    if (!email) {
      await transaction.rollback();
      return response.status(400).json({
        errors: [{
          type: "field",
          field: "email",
          message: "Email is required"
        }]
      });
    }

    // Create new pending registration (will delete old one)
    const { pending, code } = await createPendingRegistration({
      email,
      username,
      password,
      firstname,
      lastname,
      gender
    }, transaction);

    // Send verification email
    await sendVerificationEmail(email, code, firstname);

    await transaction.commit();
    
    return response.status(200).json({ 
      message: "New verification code sent to your email"
    });

  } catch (e) {
    console.error("Resend verification error:", e);
    if (!transaction.finished) {
      await transaction.rollback();
    }
    return response.status(500).json({
      errors: [{
        type: "global",
        field: "general",
        message: "Failed to resend verification code"
      }]
    });
  }
};

module.exports = {
    register,
    login,
    logout,
    updateUserProfile,
    getSession,
    sendPasswordResetLink,
    chekPasswordResetLink,
    resetPassword,
    sendVerificationCode,
    verifyCodeAndRegister,
    resendVerificationCode
}
