const { getAll } = require('../services/skillsService');
const sequelize = require('../utils/database');

const getMetaData = async (request, response,next) => {
    try {
        const skills = await getAll();
        const metaData = {
            skills: skills,
        };
        response.json(metaData);
        response.end();
    } catch (error) {
        next({status:404,message:'Error -S>' + error});
    }
}


module.exports = {
    getMetaData,
}