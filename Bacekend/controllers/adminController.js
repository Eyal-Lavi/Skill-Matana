const User =  require('../models/user');
const {addPermission , addUserPermission} = require('../services/permissionService');
const { updateSkillRequestStatus, getAllPendingRequests } = require('../services/skillRequestsService');
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
    const transaction = await sequelize.transaction();
    try{
        
        const {userId, permissionId} = request.body;
        if (!userId || !permissionId){
            throw new Error('please enter userId and permissionId');
        }
        const newUserPermission = await addUserPermission(userId , permissionId , transaction);
        await transaction.commit();
        response.status(201).json(newUserPermission);
    }catch(e){
        await transaction.rollback();
        response.status(409).json({message:e.message});
    }
}

const handleSkillRequestStatus  = async(request , response , next) => {
    try{
        const {requestId , status} = request.body;

        if(!requestId || !status){
           return response.status(400).json({message:'Missing requestId or status'});
        }

        const updatedRequest = await updateSkillRequestStatus(requestId , status);
        response.status(200).json({message: `Skill request ${status}`, request: updatedRequest});
    }catch(e){
        response.status(409).json({message: e.message});
    }
}

const fetchPendingRequests  = async(request , response , next) => {
    try{
        const allRequests = await getAllPendingRequests();
        response.status(200).json(allRequests);
    }catch(e){
        response.status(409).json({message:e.message});
    }
}

module.exports = {
    addPermissionToDB,
    addPermissionToUser,
    handleSkillRequestStatus,
    fetchPendingRequests
}