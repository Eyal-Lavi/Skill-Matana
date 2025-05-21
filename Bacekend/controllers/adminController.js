const User =  require('../models/user');
const {addPermissionToDB} = require('../services/permissionService')

const addPermission = async (request, response, next) => {
    console.log("inside permission");
    try{
        const permissionName = request.body?.permission;
        console.log(permissionName);
        
        
        if(!permissionName){
            throw new Error("Premission is required field");
        }

        const newPermission = await addPermissionToDB(permissionName);

        response.status(201).json({ message: 'Permission created', permission: newPermission });
    }catch(e){
        next({status:404,message:e.message});
    }
}
// const assignPermission = (request, response, next) => {
//     try{
//         const permission = request.body?.newPermission;
        
//         if(!permission){
//             throw new Error("Premission is required field");
//         }


//     }catch(e){
//         console.log(e);
        
//     }
// }

module.exports = {
    addPermission,
}