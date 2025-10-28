
const { Op } = require('sequelize');
const {Skill,SkillUser,UserPermission,Permission} = require('../models'); 

const getAll = async (options = {}) => {
    const {
        search = '',
        status = null,
        sortBy = 'name',
        sortOrder = 'ASC'
    } = options;

    
    const whereClause = {};
    
    if (search) {
        whereClause.name = {
            [Op.iLike]: `%${search}%`
        };
    }
    
    if (status !== null && status !== undefined) {
        whereClause.status = status;
    }

    const skills = await Skill.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder.toUpperCase()]],
        attributes: ['id', 'name', 'status']
    });
    
    return {
        data: skills.rows,
        total: skills.count,
    };
}

const getAllForUser = async (userId) => {
    if(!userId){
        return new Error("User ID is required");
    }

    const skills = await SkillUser.findAll({
        where: { userId: userId },
        include: [
            {
                model: Skill,
                attributes: ['id', 'name'],
                where: { status: 1 },
            },
        ],
    });

    return skills;
}

const addSkillToUser = async (userId, skillId, transaction) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!skillId) {
        throw new Error("Skill ID is required");
    }

    if (!transaction) {
        throw new Error("Transaction is required");
    }

    const existingSkill = await Skill.findOne({
        where: { id: skillId },
        transaction
    });

    if (!existingSkill) {
        throw new Error("The skills you tried to add does not exist");
    }

    const existingUserSkill = await SkillUser.findOne({
        where: { 
            skillId: skillId,
            userId: userId
        },
        transaction
    });

    if (existingUserSkill) {
        throw new Error("The skills you tried to add exist for this user");
    }
    
    await SkillUser.create({
        userId: userId,
        skillId: skillId
    }, { transaction });

    return {
        message: "Skills added successfully",
        status: 200,
        permission: existingSkill
    };
};

const addSkillToDB = async (skillName) => {
    if (!skillName) {
        throw new Error("Valid permission name is required");
    }

    const newSkills = await Skill.create({ name: skillName });

    return {
        message: "Skills created successfully",
        status: 201,
        permission: newSkills
    };
};

const updateSkillStatus = async (skillId, status) => {
    if (!skillId) {
        throw new Error("Skill ID is required");
    }

    if (status === undefined || ![0, 1].includes(status)) {
        throw new Error("Valid status is required (0 or 1)");
    }

    const skill = await Skill.findByPk(skillId);
    
    if (!skill) {
        throw new Error("Skill not found");
    }

    skill.status = status;
    await skill.save();

    return skill;
};

module.exports = {
    getAll,
    getAllForUser,
    addSkillToUser,
    addSkillToDB,
    updateSkillStatus
};
