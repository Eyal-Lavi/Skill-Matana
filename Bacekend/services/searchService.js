const { Op } = require('sequelize');
const {User , Skill , UserImage } = require('../models');
const searchUsersByNameAndSkillIds  = async(name , skillId, userIdRequester) => {
    

    const whereClause = name ? {
        [Op.and]: [
            { id: { [Op.ne]: userIdRequester } },
            {
                [Op.or]: [
                    {firstName: {[Op.like]:`%${name}%`}},
                    {lastName: {[Op.like]:`%${name}%`}},
                    {username: {[Op.like]:`%${name}%`}},
                ]
            }
        ]
    } : {
        id: { [Op.ne]: userIdRequester }
    };

    const skillInclude = {
        model: Skill,
        as: 'skills',
        through: { attributes: [] }
    };

    if(skillId && skillId.length > 0){
        skillInclude.where = {
            id: {
                [Op.in]: Array.isArray(skillId) ? skillId : [skillId]
            }
        };
        skillInclude.required = true;
    }

    return await User.findAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        include: [
            skillInclude,
            {
                model: UserImage,
                as: 'Images',
                where: { typeId: 1 },
                required: false
            }
        ]
    });

}

module.exports = {
    searchUsersByNameAndSkillIds
}