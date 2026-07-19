const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const {
  getDeposits,
  getDepositsByUser,
  addDeposit,
  updateDeposit,
  deleteDeposit,
} = require("../controllers/depositController");

router.get("/", authenticate, requireAdmin, getDeposits);
router.get("/user/:userId", authenticate, getDepositsByUser);
router.post("/", authenticate, requireAdmin, addDeposit);
router.put("/:id", authenticate, requireAdmin, updateDeposit);
router.delete("/:id", authenticate, requireAdmin, deleteDeposit);

module.exports = router;
