const User = require('../models/user');
const bcrypt = require('bcrypt'); 
const sequelize = require('sequelize');
const Permission = require('../models/permission');
require('../models/userPermission');

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
            },
            include:[
                {
                    model:Permission,
                    attributes:['id' , 'name'],
                    through:{attributes:[]}
                }
            ]
        });

        if (!existUser) {
            response.status(401).json({
                message:"Invalid username or email",
          
            });
            return;
        }
        const isMatchPassword = await bcrypt.compare(user.password , existUser.password);
        if(!isMatchPassword){
            return response.status(401).json({message:"invalid username or password"});      
        }
        
        
        const permissions = existUser.Permissions.map(permission => permission.name);

        console.log(existUser);
        
        request.session.isLoggedIn = true;
        request.session.user = {
            id: existUser.id,
            username: existUser.username,
            firstName:existUser.firstName,
            lastName:existUser.lastName,
            gender:existUser.gender,
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