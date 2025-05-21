const User = require('../models/user');
const sequelize = require('sequelize');

const login = async (request, response, next) => {
    console.log("Inside login");
    try {
        const user = request.body;

        const existUser = await User.findOne({
            where: {
                [sequelize.Op.or]:{
                    username: user.usernameOrEmail,
                    email: user.usernameOrEmail,
                },
                include: [
                    {
                        model: Permission, // Join with the Permission table
                        attributes: ['id'], // Only fetch the permission code
                    }
                ]
                // ,
                // [sequelize.Op.and]:{
                //     password: user.password,
                // }
            }
        });

        if (!existUser) {
            response.status(401).json({
                message:"Invalid username or email",
          
            });
            return;
        }
        
        const permissions = existUser.Permissions.map(permission => permission.code);

        
        request.session.isLoggedIn = true;
        request.session.user = {
            id: existUser.id,
            username: existUser.username,
            permissions: permissions,
        };

        
        request.session.save(() => {
            response.redirect(200, '/dashboard');
        });

    } catch (e) {
        console.error(e);
        response.status(500).json({ message: "Internal server error" });
    }
}
const register = async (request, response, next) => {
    console.log("Inside register");
    try {
        const user = request.body;

        const existUser = await User.findOne({
            where: {
                username: user.username
            }
        });

        if (existUser) {
            response.json({
                error: {
                    field: "username",
                    info: "Already exist"
                }
            });
            return;
        }
        // const errors = validateValues(userReg);
        // if(!errors){

        // }
        
        await User.create({
            username: user.username,
            email: user.email,
            password: user.password,
            firstName: user.firstname,
            lastName: user.lastname,
            gender: user.gender,
        });

        response.json({
            info:"register confirm"
        });
        response.end();
    } catch (e) {

    }
}

module.exports = {
    register,
    login
}