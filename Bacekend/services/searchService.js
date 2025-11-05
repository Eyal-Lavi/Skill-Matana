const { Op } = require('sequelize');
const {User , Skill , UserImage } = require('../models');
const searchUsersByNameAndSkillIds  = async(name , skillId, userIdRequester) => {
    console.log(1);
    
    const whereClause = {};
    if(name){
        whereClause[Op.or] = [
            {firstName: {[Op.like]:`%${name}%`}},
            {lastName: {[Op.like]:`%${name}%`}},
            {username: {[Op.like]:`%${name}%`}},
        ];
        whereClause[Op.and] = [
            {id: {[Op.ne]: userIdRequester}}
        ];
    }


    console.log(whereClause);


    if(!skillId || skillId.length === 0){
        return await User.findAll({
            where: whereClause,
            attributes:{exclude:['password']},
            include:[
                {
                    model:Skill,
                    as:'skills',
                    through:{attributes:[]}
                },
                {
                    model:UserImage,
                    as:'Images',
                    where:{typeId:1},
                    required:false
                }
            ]
        });
    }

    const usersWithSkill = await User.findAll({
      attributes: ['id'],
      where: {
        id: {
          [Op.ne]: userIdRequester
        }
      },
      include: [{
        model: Skill,
        as: 'skills',
        where: {
          id: {
            [Op.in]: Array.isArray(skillId) ? skillId : [skillId]
          },
        },
        attributes: [],
        through: { attributes: [] }
      }]
    });

    const userIds = usersWithSkill.map(user => user.id);

    if(userIds.length === 0) {
      return [];
    }
    
    return await User.findAll({
      where: {
        ...whereClause,
        id: {
          [Op.in]: userIds
        }
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Skill,
          as: 'skills',
          through: { attributes: [] }
        },
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