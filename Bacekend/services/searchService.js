const { Op } = require('sequelize');
const {User , Skill , UserImage } = require('../models');
const searchUsersByNameAndSkillIds  = async(name , skillId) => {
    console.log(1);
    
    const whereClause = {};
    if(name){
        whereClause[Op.or] = [
            {firstName: {[Op.like]:`${name}`}},
            {lastName: {[Op.like]:`${name}`}},
            {username: {[Op.like]:`${name}`}},
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

    return await User.findAll({
        where:whereClause,
        attributes:{exclude:['password']},
        include:[
            {
                model:Skill,
                as:'Skills',
                attributes:['id' , 'name'],
                where:{
                    id:{
                        [Op.in]:skillId
                    }
                }
            },
            {
                model:UserImage,
                as:'Images',
                where:{typeId:1},
                required:false
            }
        ],
        group:['User.id']
    });
}

module.exports = {
    searchUsersByNameAndSkillIds
}