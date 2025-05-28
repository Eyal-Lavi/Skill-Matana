const User =  require('../models/user');
const {addPermission , addUserPermission} = require('../services/permissionService');
const { sequelize } = require('../utils/database');

const addPermissionToDB = async (request, response, next) => {
    console.log("inside permission");
    try{
        const {permissionName} = request.body;
        const newPermission = await addPermission(permissionName);

        response.status(201).json({ message: 'Permission created', permission: newPermission });
    }catch(e){
        response.status(409).json({message:e.message});
    }
}

const addPermissionToUser= async (request , response , next) => {
    console.log("inside addPermissionToUser");
    
    try{
        const transaction = await sequelize.transaction();
        const {userId, permissionId} = request.body;
        if (!userId || !permissionId){
            throw new Error('please enter userId and permissionId');
        }
        const newUserPermission = await addUserPermission(userId , permissionId , transaction);
        response.status(201).json(newUserPermission);
    }catch(e){
        response.status(409).json({message:e.message});
    }
}

module.exports = {
    addPermissionToDB,
    addPermissionToUser
}