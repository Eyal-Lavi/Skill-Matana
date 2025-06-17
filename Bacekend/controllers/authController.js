const sequelize = require('../utils/database');
const { addPermissionToUser } = require('../services/permissionService');
const { 
        findUserByUsernameOrEmail,
        validateUserFields,
        ComperePasswords,
        createUser,
        findUserByUsernameOrEmailWithPermissions
     } = require('../services/authService');

const logout = async (request, response, next) => {
    try {
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
            response.status(401).json({
                message:"Invalid username or email",
            });
            return;
        }

        const isMatchPassword = await ComperePasswords(user.password , existUser.password);

        if(!isMatchPassword){
            return response.status(401).json({message:"invalid username or password"});      
        }
        
        const permissions = existUser.Permissions.map(permission => ({id: permission.id ,  name: permission.name}) );

        console.log(existUser);
        
        request.session.isLoggedIn = true;
        request.session.isAdmin = permissions.some(permission => permission.id === 99);
        request.session.user = {
            id: existUser.id,
            username: existUser.username,
            firstName:existUser.firstName,
            lastName:existUser.lastName,
            gender:existUser.gender,
            permissions: permissions,
        };
``
        
        request.session.save(() => {
           response.status(200).json({
                message: "Login successful",
                user: { profilePicture: null , ...request.session.user}
            });
        });

    } catch (e) {
        console.error(e);
        next({ message: e.message });
    }
}
const register = async (request, response) => {
    const transaction = await sequelize.sequelize.transaction();

    try {
        const user = request.body;

        const missingField = validateUserFields(user);

        if (missingField) {
            await transaction.rollback();
            return response.status(400).json({ error: `${missingField} is required` });
        }

        const userByUsername = await findUserByUsernameOrEmail(user.username, transaction);
        const userByEmail =  await findUserByUsernameOrEmail(user.email, transaction);

        const existUser = userByUsername || userByEmail;

        if (existUser) {
            await transaction.rollback();
            return response.status(400).json({
                error: {
                    field: `${userByUsername ? 'Username' : ''} ${ userByUsername && userByEmail ? 'And' : '' } ${userByEmail ? 'Email' : ''}`.trim(),
                    info: "Already exists"
                }
            });
        }

        await createUser(user, transaction);

        const newUser = await findUserByUsernameOrEmail(user.username, transaction);

        if (!newUser) {
            await transaction.rollback();
            return response.status(500).json({ error: "User not found after creation" });
        }

        await addPermissionToUser(newUser.id, 1, transaction);

        await transaction.commit();
        return response.status(201).json({ info: "Register confirmed" });

    } catch (e) {
        console.error("Register error:", e);
        await transaction.rollback();
        next({ message: e.message });
    }
};

module.exports = {
    register,
    login,
    logout
}