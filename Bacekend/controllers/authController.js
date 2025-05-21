const User = require('../models/user');
const sequelize = require('sequelize');

const login = async (request, response, next) => {
    console.log("Inside register");
    try {
        const user = request.body;

        const existUser = await User.findOne({
            where: {
                [sequelize.Op.or]:{
                    username: user.usernameOrEmail,
                    email: user.usernameOrEmail,
                }
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
        
        request.session.isLoggedIn = true;
        
        request.session.save(() => {
            response.redirect(301, '/dashboard');
        });

    } catch (e) {
        console.log(e);
        
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