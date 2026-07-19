const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const { addUser, getUsers, updateUser, deleteUser } = require("../controllers/userController");

router.get("/", authenticate, requireAdmin, getUsers);
router.post("/", authenticate, requireAdmin, addUser);
router.put("/:id", authenticate, requireAdmin, updateUser);
router.delete("/:id", authenticate, requireAdmin, deleteUser);

module.exports = router;
