const User =  require('../models/user');
const {addPermission , addUserPermission} = require('../services/permissionService');
const { updateSkillRequestStatus, getAllPendingRequests } = require('../services/skillRequestsService');
const { updateSkillStatus } = require('../services/skillsService');
const { Op } = require('sequelize');
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

        console.log(requestId + status);
        
        if(!requestId || !status){
           return response.status(400).json({message:'Missing requestId or status'});
        }

        const validStatuses = ['approved', 'rejected'];
        if (!validStatuses.includes(status)) {
          return response.status(400).json({ message: 'Invalid status value' });
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

const handleSkillStatusUpdate = async (request, response, next) => {
    try {
        const { skillId, status } = request.body;
        
        if (!skillId || status === undefined) {
            return response.status(400).json({ message: 'Missing skillId or status' });
        }

        const validStatuses = [0, 1];
        if (!validStatuses.includes(status)) {
            return response.status(400).json({ message: 'Invalid status value. Must be 0 or 1' });
        }

        const updatedSkill = await updateSkillStatus(skillId, status);
        response.status(200).json({ 
            message: `Skill ${status === 1 ? 'activated' : 'deactivated'} successfully`, 
            skill: updatedSkill 
        });
    } catch (e) {
        response.status(409).json({ message: e.message });
    }
}

const getAllUsers = async (request, response, next) => {
    try {
        const { page = 1, limit = 10, search = '', status = null } = request.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { username: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }
        if (status !== null && status !== undefined) {
            whereClause.status = status;
        }

        const { count, rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'gender', 'status', 'instagramUrl', 'linkedinUrl', 'githubUrl'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'ASC']]
        });

        response.status(200).json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (e) {
        response.status(500).json({ message: e.message });
    }
}

const updateUserStatus = async (request, response, next) => {
    try {
        const { userId, status } = request.body;

        if (!userId || status === undefined) {
            return response.status(400).json({ message: 'Missing userId or status' });
        }

        const validStatuses = [0, 1];
        if (!validStatuses.includes(status)) {
            return response.status(400).json({ message: 'Invalid status value. Must be 0 or 1' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        user.status = status;
        await user.save();

        response.status(200).json({
            message: `User ${status === 1 ? 'activated' : 'deactivated'} successfully`,
            user
        });
    } catch (e) {
        response.status(409).json({ message: e.message });
    }
}

module.exports = {
    addPermissionToDB,
    addPermissionToUser,
    handleSkillRequestStatus,
    fetchPendingRequests,
    handleSkillStatusUpdate,
    getAllUsers,
    updateUserStatus
}