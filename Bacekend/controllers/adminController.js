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

const updateUser = async (request, response, next) => {
    try {
        const { userId, username, firstName, lastName, email, gender, password, instagramUrl, linkedinUrl, githubUrl } = request.body;

        if (!userId) {
            return response.status(400).json({ message: 'Missing userId' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (username !== undefined) user.username = username;
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (email !== undefined) user.email = email;
        if (gender !== undefined) user.gender = gender;
        if (password !== undefined && password !== '') user.password = password; // Will be hashed by hook
        if (instagramUrl !== undefined) user.instagramUrl = instagramUrl;
        if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
        if (githubUrl !== undefined) user.githubUrl = githubUrl;

        await user.save();

        // Return user without password
        const userResponse = user.toJSON();
        delete userResponse.password;

        response.status(200).json({
            message: 'User updated successfully',
            user: userResponse
        });
    } catch (e) {
        response.status(409).json({ message: e.message });
    }
}

const loginAsUser = async (request, response, next) => {
    try {
        const { userId } = request.body;

        // Check if the current user is admin
        if (!request.session.isAdmin) {
            return response.status(403).json({ message: 'Only admins can use this feature' });
        }

        if (!userId) {
            return response.status(400).json({ message: 'Missing userId' });
        }

        const { UserImage, Skill, Permission } = require('../models');
        const { Op } = require('sequelize');
        const transaction = await sequelize.transaction();

        // Find the target user with all their data
        const targetUser = await User.findByPk(userId, {
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
                            [Op.eq]: 1
                        }
                    },
                    required: false,
                    as: 'skills'
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
                }
            ],
            transaction
        });

        if (!targetUser) {
            await transaction.rollback();
            return response.status(404).json({ message: 'User not found' });
        }

        await transaction.commit();

        // Prepare user data similar to login
        const permissions = targetUser.Permissions.map(permission => ({
            id: permission.id,
            name: permission.name
        }));

        const profileImg = targetUser.Images.find(img => img.typeId === 1);
        const bannerImg = targetUser.Images.find(img => img.typeId === 2);
        
        const skills = targetUser.skills.map(skill => ({
            id: skill.id,
            name: skill.name
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
        const connsA = Array.isArray(targetUser.connectionsA) ? targetUser.connectionsA.map(mapConn) : [];
        const connsB = Array.isArray(targetUser.connectionsB) ? targetUser.connectionsB.map(mapConn) : [];
        const connectionsMap = new Map();
        [...connsA, ...connsB].forEach(c => { if (!connectionsMap.has(c.id)) connectionsMap.set(c.id, c); });
        const connections = Array.from(connectionsMap.values());

        // Update session to the target user
        request.session.isLoggedIn = true;
        request.session.isAdmin = permissions.some(p => p.id === 99);
        request.session.originalAdminId = request.session.user?.id; // Save original admin ID for reference
        request.session.user = {
            id: targetUser.id,
            username: targetUser.username,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            email: targetUser.email,
            gender: targetUser.gender,
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
            message: 'Logged in as user successfully',
            user: request.session.user
        });
    } catch (e) {
        response.status(500).json({ message: e.message });
    }
}

module.exports = {
    addPermissionToDB,
    addPermissionToUser,
    handleSkillRequestStatus,
    fetchPendingRequests,
    handleSkillStatusUpdate,
    getAllUsers,
    updateUserStatus,
    updateUser,
    loginAsUser
}