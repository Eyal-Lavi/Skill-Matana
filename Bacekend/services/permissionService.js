const Permission = require('../models/permission');
const UserPermission = require('../models/userPermission');

const addPermissionToUser = async (userId, permissionId, transaction) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!permissionId) {
        throw new Error("Permission ID is required");
    }

    if (!transaction) {
        throw new Error("Transaction is required");
    }

    const existingPermission = await Permission.findOne({
        where: { id: permissionId },
        transaction
    });

    if (!existingPermission) {
        throw new Error("The permission you tried to add does not exist");
    }

    await UserPermission.create({
        userId,
        permissionId
    }, { transaction });

    await transaction.commit();
    
    return {
        message: "Permission added successfully",
        status: 200,
        permission: existingPermission
    };
};

const addPermissionToDB = async (permissionName) => {
    if (!permissionName || typeof permissionName !== 'string') {
        throw new Error("Valid permission name is required");
    }

    const newPermission = await Permission.create({ name: permissionName });

    return {
        message: "Permission created successfully",
        status: 201,
        permission: newPermission
    };
};

module.exports = {
    addPermissionToUser,
    addPermissionToDB
};
