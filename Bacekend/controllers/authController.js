const sequelize = require('../utils/database');
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
        resetUserPassword
     } = require('../services/authService');
const UserImage = require('../models/userImage');
const { User } = require('../models');

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

    // העלאת תמונת פרופיל אם קיימת
    if (profileImage) {
      const result = await uploadBase64Image(profileImage, `${id}_profile`);
      await UserImage.upsert({
        userId: id,
        url: result.url,
        typeId: 1, // 1 = profile
      }, { transaction });
    }

    console.log("Here 1");
    
    await transaction.commit();
    console.log("Here 2");

    let userWithImage = await updatedUser.reload({
      include: { model: UserImage, as: 'Images' }
    });
    console.log("Here 3");

    const profileImg = userWithImage.Images.find(img => img.typeId === 1);
    userWithImage = userWithImage.toJSON();
    console.log("Here 3");

    delete userWithImage.Images;
    console.log("Here 4");

    // עדכון session אם מדובר במשתמש המחובר
    if (req.session.user?.id === userWithImage.id) {
      req.session.user = {
        ...req.session.user,
        firstName: userWithImage.firstName,
        lastName: userWithImage.lastName,
        email: userWithImage.email,
        gender: userWithImage.gender,
        profilePicture: profileImg?.url || null
      };
    }
    console.log("Here 5");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...userWithImage,
        profilePicture: profileImg?.url || null
      }
    });
    console.log("Here 6");

  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSession = (req, res) => {
  if (req.session.isLoggedIn && req.session.user) {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.session.user
    });
  } else {
    return res.status(200).json({ isAuthenticated: false });
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
            response.clearCookie('connect.sid'); // Clear the session cookie
            response.status(200).json({ message: "Logged out successfully" });
        });

        // return response.status(200).json({ message: "Logged out successfully" });

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
    
    // const images = existUser.Images.map(image => ({
    //   // id: image.id,
    //   url: image.url
    // }));
    // console.log(images);
    // const userWithImage = await updatedUser.reload({
    //   include: { model: UserImage, as: 'Images' }
    // });

    const profileImg = existUser.Images.find(img => img.typeId === 1);
    const bannerImg = existUser.Images.find(img => img.typeId === 2);
    
    

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
      bannerPicture: bannerImg?.url || null
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
    
    const link = `${process.env.CLIENT_URL}/reset-password/${token}` 
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
    response.status(500).json({message:e.message});
  }
}
module.exports = {
    register,
    login,
    logout,
    updateUserProfile,
    getSession,
    sendPasswordResetLink,
    chekPasswordResetLink,
    resetPassword
}