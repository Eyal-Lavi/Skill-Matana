const { Op } = require('sequelize');
const {User , Skill , UserImage } = require('../models');
const searchUsersByNameAndSkillIds  = async(name , skillId) => {
    console.log(1);
    
    const whereClause = {};
    if(name){
        whereClause[Op.or] = [
            {firstName: {[Op.like]:`%${name}%`}},
            {lastName: {[Op.like]:`%${name}%`}},
            {username: {[Op.like]:`%${name}%`}},
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
                    as:'Skills',
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

    console.log(2);

    const usersWithSkill = await User.findAll({
      attributes: ['id'],
      include: [{
        model: Skill,
        as: 'Skills',
        where: {
          id: {
            [Op.in]: skillId
          }
        },
        attributes: [], // no need to fetch skill details
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
          as: 'Skills',
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