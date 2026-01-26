const { SystemNotification } = require("../models");
const { Op } = require("sequelize");

const createNotification = async (userId, type, title, message, link = null) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!type || !title || !message) {
    throw new Error("Type, title, and message are required");
  }

  const notification = await SystemNotification.create({
    userId,
    type,
    title,
    message,
    link,
    isRead: false,
  });

  return notification;
};

const getAllNotificationsForUser = async (userId, options = {}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { isRead = null, limit = null, offset = 0 } = options;

  const whereClause = { userId };

  if (isRead !== null && isRead !== undefined) {
    whereClause.isRead = isRead;
  }

  const notifications = await SystemNotification.findAndCountAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
    limit: limit ? parseInt(limit) : undefined,
    offset: parseInt(offset),
  });

  return {
    data: notifications.rows,
    total: notifications.count,
    unread: notifications.rows.filter((n) => !n.isRead).length,
  };
};

const getUnreadNotificationsCount = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const count = await SystemNotification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  return count;
};

const markAsRead = async (notificationId, userId) => {
  if (!notificationId) {
    throw new Error("Notification ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const notification = await SystemNotification.findByPk(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("Not authorized to update this notification");
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

const markAllAsRead = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const updated = await SystemNotification.update(
    { isRead: true },
    {
      where: {
        userId,
        isRead: false,
      },
    }
  );

  return updated[0]; // Returns number of affected rows
};

const deleteNotification = async (notificationId, userId) => {
  if (!notificationId) {
    throw new Error("Notification ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const notification = await SystemNotification.findByPk(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("Not authorized to delete this notification");
  }

  await notification.destroy();

  return true;
};

const createNotificationForUser = async (userId, type, title, message, link = null) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!type || !title || !message) {
    throw new Error("Type, title, and message are required");
  }

  const notification = await SystemNotification.create({
    userId,
    type,
    title,
    message,
    link,
    isRead: false,
  });

  return notification;
};

const createNotificationForAllUsers = async (type, title, message, link = null) => {
  if (!type || !title || !message) {
    throw new Error("Type, title, and message are required");
  }

  const { User } = require("../models");
  const users = await User.findAll({
    attributes: ["id"],
  });

  const notifications = await Promise.all(
    users.map((user) =>
      SystemNotification.create({
        userId: user.id,
        type,
        title,
        message,
        link,
        isRead: false,
      })
    )
  );

  return notifications;
};

const getAllNotificationsForAdmin = async (options = {}) => {
  const { page = 1, limit = 20, search = '', type = null } = options;
  const offset = (page - 1) * limit;

  const whereClause = {};
  
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { message: { [Op.iLike]: `%${search}%` } },
      { type: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (type) {
    whereClause.type = type;
  }

  const { User } = require("../models");

  const notifications = await SystemNotification.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "firstName", "lastName", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return {
    data: notifications.rows,
    total: notifications.count,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(notifications.count / limit),
  };
};

const getNotificationGroupedStats = async () => {
  const { User } = require("../models");
  const { sequelize } = require("../utils/database");

  // Group notifications by type, title, message, link (same content)
  const groupedNotifications = await SystemNotification.findAll({
    attributes: [
      "type",
      "title",
      "message",
      "link",
      [sequelize.fn("COUNT", sequelize.col("id")), "totalCount"],
      [sequelize.fn("COUNT", sequelize.literal("CASE WHEN is_read = true THEN 1 END")), "readCount"],
      [sequelize.fn("MIN", sequelize.col("createdAt")), "firstSent"],
      [sequelize.fn("MAX", sequelize.col("createdAt")), "lastSent"],
    ],
    group: ["type", "title", "message", "link"],
    having: sequelize.literal("COUNT(id) > 1"), // Only system notifications (sent to multiple users)
    order: [[sequelize.fn("MAX", sequelize.col("createdAt")), "DESC"]],
    raw: true,
  });

  return groupedNotifications.map((group) => ({
    type: group.type,
    title: group.title,
    message: group.message,
    link: group.link,
    totalCount: parseInt(group.totalCount || 0),
    readCount: parseInt(group.readCount || 0),
    unreadCount: parseInt(group.totalCount || 0) - parseInt(group.readCount || 0),
    firstSent: group.firstSent,
    lastSent: group.lastSent,
  }));
};

const getNotificationDetails = async (type, title, message, link = null) => {
  const { User } = require("../models");

  const whereClause = {
    type,
    title,
    message,
  };

  if (link !== null) {
    whereClause.link = link;
  } else {
    whereClause.link = { [Op.is]: null };
  }

  const notifications = await SystemNotification.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "firstName", "lastName", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const readUsers = notifications.filter((n) => n.isRead).map((n) => n.user);
  const unreadUsers = notifications.filter((n) => !n.isRead).map((n) => n.user);

  return {
    type,
    title,
    message,
    link,
    totalCount: notifications.length,
    readCount: readUsers.length,
    unreadCount: unreadUsers.length,
    readUsers,
    unreadUsers,
    notifications,
  };
};

const deleteSystemNotifications = async (type, title, message, link = null) => {
  if (!type || !title || !message) {
    throw new Error("Type, title, and message are required");
  }

  const whereClause = {
    type,
    title,
    message,
  };

  if (link !== null) {
    whereClause.link = link;
  } else {
    whereClause.link = { [Op.is]: null };
  }

  const deletedCount = await SystemNotification.destroy({
    where: whereClause,
  });

  return deletedCount;
};

module.exports = {
  createNotification,
  getAllNotificationsForUser,
  getUnreadNotificationsCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotificationForUser,
  createNotificationForAllUsers,
  getAllNotificationsForAdmin,
  getNotificationGroupedStats,
  getNotificationDetails,
  deleteSystemNotifications,
};

