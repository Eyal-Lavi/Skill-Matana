const {
  getAll,
  getAllForUser,
  getAllSentForUser,
  getAllReceivedForUser,
  addContactRequest,
  updateContactRequestStatus,
  deleteContactRequest,
} = require("../services/contactRequestsService");
const { deleteConnection } = require("../services/connectionsService");
const sequelize = require("../utils/database");


const sendConnectionRequest = async (request, response, next) => {
  try {
    const transaction = await sequelize.sequelize.transaction();

    const userId = request.session.user.id;
    const targetUserId = request.body.targetUserId;
    const message = request.body.message;
    console.log(
      `User with id  : ${userId} send request to user with id : ${targetUserId}, with message: ${message} `
    );

    if (!userId || !targetUserId) {
      return response
        .status(400)
        .json({ message: `User ID and TargetUserId ID are required` });
    }

    await addContactRequest(userId, targetUserId,message, transaction);
    await transaction.commit();

    response.json({ message: "Request sent successfully." });
    response.end();
  } catch (error) {
    next({ status: 404, message: "Error ->" + error });
  }
};

const getAllRequestsForUser = async (request, response, next) => {
  try {
    const userId = request.session.user.id;
    const data = await getAllForUser(userId);
    response.json({ data });
  } catch (error) {
    next({ status: 404, message: "Error ->" + error });
  }
};

const getReceivedRequestsForUser = async (request, response, next) => {
  try {
    const userId = request.session.user.id;
    const data = await getAllReceivedForUser(userId);
    response.json({ data });
  } catch (error) {
    next({ status: 404, message: "Error ->" + error });
  }
};

const getSentRequestsForUser = async (request, response, next) => {
  try {
    const userId = request.session.user.id;
    const data = await getAllSentForUser(userId);
    response.json({ data });
  } catch (error) {
    next({ status: 404, message: "Error ->" + error });
  }
};

const updateRequestStatus = async (request, response, next) => {
  try {
    const requestId = request.params.id;
    const { status } = request.body;
    const updated = await updateContactRequestStatus(requestId, status);
    response.json({ message: "Request updated successfully.", data: updated });
  } catch (error) {
    next({ status: 404, message: "Error ->" + error });
  }
};

const deleteRequest = async (request, response, next) => {
  try {
    const requestId = request.params.id;
    const userId = request.session.user.id;
    await deleteContactRequest(requestId, userId);
    response.status(200).json({ message: 'Request canceled successfully.' });
  } catch (error) {
    next({ status: 404, message: "Error ->" + error });
  }
};

const disconnectConnection = async (request, response, next) => {
  try {
    const userId = request.session.user.id;
    const targetUserId = request.body.targetUserId;
    
    if (!targetUserId) {
      return response.status(400).json({ message: "Target User ID is required" });
    }

    await deleteConnection(userId, targetUserId);
    response.status(200).json({ message: "Connection disconnected successfully." });
  } catch (error) {
    next({ status: 404, message: "Error ->" + error.message });
  }
};

module.exports = {
  sendConnectionRequest,
  getAllRequestsForUser,
  getReceivedRequestsForUser,
  getSentRequestsForUser,
  updateRequestStatus,
  deleteRequest,
  disconnectConnection,
};
