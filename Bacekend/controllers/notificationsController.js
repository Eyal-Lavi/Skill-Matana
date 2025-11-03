const {
  getAllNotificationsForUser,
  getUnreadNotificationsCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../services/notificationsService");

const getAllNotifications = async (request, response, next) => {
  try {
    const userId = request.session.user.id;
    const { isRead, limit, offset } = request.query;

    const result = await getAllNotificationsForUser(userId, {
      isRead: isRead === "true" ? true : isRead === "false" ? false : null,
      limit,
      offset,
    });

    response.json(result);
  } catch (error) {
    next({ status: 500, message: error.message || "Error fetching notifications" });
  }
};

const getUnreadCount = async (request, response, next) => {
  try {
    const userId = request.session.user.id;
    const count = await getUnreadNotificationsCount(userId);

    response.json({ count });
  } catch (error) {
    next({ status: 500, message: error.message || "Error fetching unread count" });
  }
};

const markNotificationAsRead = async (request, response, next) => {
  try {
    const notificationId = request.params.id;
    const userId = request.session.user.id;

    const notification = await markAsRead(notificationId, userId);

    response.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    next({ status: 400, message: error.message || "Error marking notification as read" });
  }
};

const markAllNotificationsAsRead = async (request, response, next) => {
  try {
    const userId = request.session.user.id;

    const updatedCount = await markAllAsRead(userId);

    response.json({
      message: "All notifications marked as read",
      updatedCount,
    });
  } catch (error) {
    next({ status: 500, message: error.message || "Error marking all notifications as read" });
  }
};

const deleteNotificationById = async (request, response, next) => {
  try {
    const notificationId = request.params.id;
    const userId = request.session.user.id;

    await deleteNotification(notificationId, userId);

    response.json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next({ status: 400, message: error.message || "Error deleting notification" });
  }
};

module.exports = {
  getAllNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
};

