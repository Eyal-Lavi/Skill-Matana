const Permission = require('../models/permission');

const addPermissionToDB = async (permissionName) => {
    if (!permissionName) {
        throw new Error("Permission name is required");
    }

    return await Permission.create({ name: permissionName });
};

module.exports = { addPermissionToDB };
