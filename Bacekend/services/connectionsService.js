const { sequelize, ContactRequest, Connection, User, UserImage } = require('../models');
const { Op } = require('sequelize');

const approveContactRequest = async (requestId, approverId) => {
  if (!requestId) {
    throw new Error("Contact Request ID is required");
  }
  if (!approverId) {
    throw new Error("Approver user ID is required");
  }

  return await sequelize.transaction(async (transaction) => {
    const req = await ContactRequest.findByPk(requestId, { transaction });
    if (!req) {
      throw new Error("Contact Request not found");
    }

    if (req.requestedTo !== approverId) {
      throw new Error("Only recipient can approve this request");
    }

    if (req.status !== 'pending') {
      throw new Error("Request is not pending");
    }

    req.status = 'approved';
    await req.save({ transaction });

    const a = Math.min(req.requestedBy, req.requestedTo);
    const b = Math.max(req.requestedBy, req.requestedTo);

    try {
      await Connection.create({ userA: a, userB: b }, { transaction });
    } catch (e) {
      if (e.name !== 'SequelizeUniqueConstraintError') throw e;
    }

    return {
      message: "Request approved and connection created",
      status: 200,
      requestId: req.id,
    };
  });
};

const getConnectionsForUser = async (userId) => {
  if (!userId) {
    return new Error("User ID is required");
  }
  const connections = await Connection.findAll({
    where: sequelize.where(
      sequelize.literal(`${userId}`),
      'IN',
      sequelize.literal('(SELECT user_a FROM connections WHERE user_b = ' + userId + ' UNION SELECT user_b FROM connections WHERE user_a = ' + userId + ')')
    )
  });
  return connections;
};

const getConnectionsWithDetailsForUser = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Find all connections where user is either userA or userB
  const connections = await Connection.findAll({
    where: {
      [Op.or]: [
        { userA: userId },
        { userB: userId }
      ]
    }
  });

  // Get the other user's ID for each connection
  const otherUserIds = connections.map(conn => 
    conn.userA === userId ? conn.userB : conn.userA
  );

  if (otherUserIds.length === 0) {
    return [];
  }

  // Fetch user details for all connected users
  const users = await User.findAll({
    where: {
      id: { [Op.in]: otherUserIds }
    },
    attributes: ['id', 'firstName', 'lastName'],
    include: [{
      model: UserImage,
      as: 'Images',
      attributes: ['url', 'typeId'],
      required: false
    }]
  });

  // Map to the format expected by frontend
  return users.map(user => {
    const profileImg = user.Images?.find(img => img.typeId === 1);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: profileImg?.url || null
    };
  });
};

const deleteConnection = async (userId, targetUserId) => {
  if (!userId || !targetUserId) {
    throw new Error("User ID and Target User ID are required");
  }

  const a = Math.min(userId, targetUserId);
  const b = Math.max(userId, targetUserId);

  const connection = await Connection.findOne({
    where: {
      userA: a,
      userB: b,
    },
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  await connection.destroy();
  return { message: "Connection deleted successfully" };
};

module.exports = {
  approveContactRequest,
  getConnectionsForUser,
  getConnectionsWithDetailsForUser,
  deleteConnection,
};
