const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const { getWastePrices, updateWastePrices } = require("../controllers/priceController");

router.get("/", getWastePrices);                               // Publik
router.put("/", authenticate, requireAdmin, updateWastePrices); // Admin only

module.exports = router;
