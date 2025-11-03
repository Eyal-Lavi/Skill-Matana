const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notificationsController");
const { isLoggedIn } = require("../middlewares/authMiddleware");

router.get("/", isLoggedIn, notificationsController.getAllNotifications);
router.get("/unread-count", isLoggedIn, notificationsController.getUnreadCount);
router.patch("/:id/read", isLoggedIn, notificationsController.markNotificationAsRead);
router.patch("/mark-all-read", isLoggedIn, notificationsController.markAllNotificationsAsRead);
router.delete("/:id", isLoggedIn, notificationsController.deleteNotificationById);

module.exports = router;

