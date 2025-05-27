const User =  require('../models/user');
const {addPermissionToDB , addPermissionToUser} = require('../services/permissionService');
const { sequelize } = require('../utils/database');

const addPermissionToDB = async (request, response, next) => {
    console.log("inside permission");
    try{
        const permissionName = request.body;
        console.log(permissionName);
        
        
        if(!permissionName || typeof permissionName !== 'string'){
            throw new Error("Premission is required field please enter proper name!!!!");
        }

        const newPermission = await addPermissionToDB(permissionName);

        response.status(201).json({ message: 'Permission created', permission: newPermission });
    }catch(e){
        next({status:404,message:e.message});
    }
}

const addPermissionToUser= async (request , response , next) => {
    try{
        const transaction = sequelize.transaction();
        const {userId, permissionId} = request.body;
        if (!userId || !permissionId){
            throw new Error('please enter userId and permissionId');
        }
        const newUserPermission = await addPermissionToUser(userId , permissionId , transaction);
        response.status(201).json(newUserPermission);
    }catch(e){
        next({status:404 , message:e.message})
    }
}

module.exports = {
    addPermissionToDB,
    addPermissionToUser
}