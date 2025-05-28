const { getAll, addSkillToUser, getAllForUser } = require('../services/skillsService');
const sequelize = require('../utils/database');

const getAllSkills = async (request, response,next) => {
    try {
        const skills = await getAll();
        response.json(skills);
        response.end();
    } catch (error) {
        next({status:404,message:'Error ->' + error});
    }
}

const getSkillsForUser = async (request, response,next) => {
    try {
        // const { id } = request.params;
        console.log("request.session.user : " + request.session.user);

        const userId = request.session.user.id ;
        
        if(!userId){
            return next({status:400,message:'User ID is required'});
        }

        const skills = await getAllForUser(userId);

        if (!skills) {
            return next({status:404,message:'No skills found for this user'});
        }

        response.json(skills);
        response.end();
    } catch (error) {
        next({status:404,message:'Error ->' + error});
    }
}

const addSkill = async (request, response,next) => {
    try {
        const transaction = await sequelize.sequelize.transaction();
        
        const userId = request.session.user.id;
        const skillId = request.body.skillId;
        console.log("userId :" + userId + " ,skillId :" +skillId);
        
        if (!userId || !skillId) {
            return response.status(400).json({ message: "User ID and Skill ID are required" });
        }

        await addSkillToUser(userId, skillId, transaction);
        await transaction.commit();
        
        response.json({ message: "Skill added successfully" });
        response.end();
    } catch (error) {
        next({status:404,message:'Error ->' + error});
    }
}


module.exports = {
    getAllSkills,
    getSkillsForUser,
    addSkill
}