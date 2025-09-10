const { ContactRequest, User, Connection } = require("../models");
const { Op } = require("sequelize");

const getAll = async (options = {}) => {
  const {
    search = "",
    status = null,
    sortBy = "createdAt",
    sortOrder = "ASC",
  } = options;

  const whereClause = {};
  if (search) {
    whereClause.message = { [Op.iLike]: `%${search}%` };
  }
  if (status !== null && status !== undefined) {
    whereClause.status = status;
  }

  const requests = await ContactRequest.findAndCountAll({
    where: whereClause,
    order: [[sortBy, sortOrder.toUpperCase()]],
    attributes: [
      "id",
      "message",
      "status",
      "requestedBy",
      "requestedTo",
      "createdAt",
      "updatedAt",
    ],
  });

  return { data: requests.rows, total: requests.count };
};

const getAllForUser = async (userId) => {
  if (!userId) {
    return new Error("User ID is required");
  }

  const requests = await ContactRequest.findAll({
    where: {
      [Op.or]: [{ requestedBy: userId }, { requestedTo: userId }],
    },
    include: [
      {
        model: User,
        as: "requester",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: User,
        as: "recipient",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return requests;
};

const getAllSentForUser = async (userId) => {
  if (!userId) {
    return new Error("User ID is required");
  }

  const sent = await ContactRequest.findAll({
    where: { requestedBy: userId },
    include: [
      {
        model: User,
        as: "recipient",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "message",
      "status",
      "requestedBy",
      "requestedTo",
      "createdAt",
      "updatedAt",
    ],
  });

  return sent;
};

const getAllReceivedForUser = async (userId) => {
  if (!userId) {
    return new Error("User ID is required");
  }

  const received = await ContactRequest.findAll({
    where: { requestedTo: userId },
    include: [
      {
        model: User,
        as: "requester",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "message",
      "status",
      "requestedBy",
      "requestedTo",
      "createdAt",
      "updatedAt",
    ],
  });

  return received;
};

const addContactRequest = async (
  requestedBy,
  requestedTo,
  message,
  transaction
) => {
  if (!requestedBy) throw new Error("User ID is required");
  if (!requestedTo) throw new Error("Target user ID is required");
  if (!transaction) throw new Error("Transaction is required");

  const existingRequest = await ContactRequest.findOne({
    where: { requestedBy, requestedTo, status: "pending" },
    transaction,
  });
  if (existingRequest) {
    throw new Error("The request you tried to add exist for this user");
  }

  const newRequest = await ContactRequest.create(
    {
      requestedBy,
      requestedTo,
      message: typeof message === "string" ? message.trim() : message,
    },
    { transaction }
  );

  return {
    message: "Request added successfully",
    status: 200,
    request: newRequest,
  };
};

const updateContactRequestStatus = async (requestId, status) => {
  if (!requestId) {
    throw new Error("Contact Request ID is required");
  }
  if (
    status === undefined ||
    !["pending", "approved", "rejected"].includes(status)
  ) {
    throw new Error("Valid status is required (pending, approved, rejected)");
  }

  const request = await ContactRequest.findByPk(requestId);
  if (!request) {
    throw new Error("Contact Request not found");
  }

  request.status = status;
  await request.save();

  // On approval, create a Connection if not exists
  if (status === 'approved') {
    const a = Math.min(request.requestedBy, request.requestedTo);
    const b = Math.max(request.requestedBy, request.requestedTo);
    await Connection.findOrCreate({
      where: { userA: a, userB: b },
      defaults: { userA: a, userB: b },
    });
  }

  return request;
};

const deleteContactRequest = async (requestId, userId) => {
  if (!requestId) {
    throw new Error("Contact Request ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const request = await ContactRequest.findByPk(requestId);
  if (!request) {
    throw new Error("Contact Request not found");
  }
  if (request.requestedBy !== userId) {
    throw new Error("Not authorized to cancel this request");
  }
  if (request.status !== 'pending') {
    throw new Error("Only pending requests can be canceled");
  }

  await request.destroy();
  return true;
};

module.exports = {
  getAll,
  getAllForUser,
  getAllSentForUser,
  getAllReceivedForUser,
  addContactRequest,
  updateContactRequestStatus,
  deleteContactRequest,
};
