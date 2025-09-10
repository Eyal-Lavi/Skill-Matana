const { sequelize, ContactRequest, Connection } = require('../models');

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

module.exports = {
  approveContactRequest,
  getConnectionsForUser,
};
