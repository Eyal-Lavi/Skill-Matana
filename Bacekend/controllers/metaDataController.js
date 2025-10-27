const { getAll } = require('../services/skillsService');
const sequelize = require('../utils/database');

const getMetaData = async (request, response,next) => {
    try {
        const skills = await getAll({search:'',status:1});
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