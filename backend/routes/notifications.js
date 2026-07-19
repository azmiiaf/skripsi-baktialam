const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const {
  getNotifications,
  addNotification,
  markAsRead,
  clearNotifications,
} = require("../controllers/notificationController");

router.get("/:userId", authenticate, getNotifications);
router.post("/", authenticate, addNotification);
router.put("/:id/read", authenticate, markAsRead);
router.delete("/user/:userId", authenticate, clearNotifications);

module.exports = router;
