const {searchUsersByNameAndSkillIds} = require('../services/searchService');

const searchUsers = async(request , response , next) =>{
    try{
        let { name , skillId} = request.query;
        const userIdRequester = request.session.user.id;

        if(!name && !skillId){
            return response.status(400).json({message:'Missing required query parameters: name and skillId.'})
        }

        if (!skillId || (Array.isArray(skillId) && skillId.length === 0)) {
            skillId = null;
        }
        if(typeof skillId === 'string'){
            skillId = skillId.split(',').map(id => parseInt(id , 10)).filter(id => !isNaN(id));
        }
        console.log(name , skillId);
        
        
       

        const users = await searchUsersByNameAndSkillIds(name , skillId,userIdRequester);
        if(users.length === 0){
           return response.status(404).json({ message: 'No users found matching the criteria.' });
        }
        console.log(users);
        
        response.status(200).json(users);

    }catch(error){
        response.status(500).json({message:'Internal server error.'});
    }
}

module.exports = {
    searchUsers,
}