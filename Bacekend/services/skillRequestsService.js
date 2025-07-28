const { SkillRequest, Skill } = require("../models")

const updateSkillRequestStatus = async(requestId , status) => {
    const request = await SkillRequest.findByPk(requestId);
    
    if(!request){
        throw new Error('Skill request not found');
    }

    if(!['approved', 'rejected'].includes(status)){
        throw new Error('Invalid status');
    }

    request.status = status;
    await request.save();

    if(status === 'approved'){
        await Skill.create({name:request.name});
    }

    return request;
}

const createSkillRequest = async(name , userId) => {
    const existingSkill = await Skill.findOne({where: {name:name}});

    if(existingSkill){
        throw new Error( 'this skill already exist');
    } 

    const existingRequest = await SkillRequest.findOne({where:{name , status:'pending'}});

    if(existingRequest) { 
        throw new Error('this request is already exist');
    }

    const newRequest = await SkillRequest.create({
        name,
        requestedBy:userId
    });
    
    return newRequest;
}

const getAllPendingRequests = async() => {
    const allPendingRequest = await SkillRequest.findAll({where:{status:'pending'}});
    return allPendingRequest;
}

module.exports = {
    updateSkillRequestStatus,
    createSkillRequest,
    getAllPendingRequests
}