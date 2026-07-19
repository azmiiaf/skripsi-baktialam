const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const { getRankingData } = require("../controllers/rankingController");

// Accessible to ALL authenticated users (nasabah & admin)
router.get("/", authenticate, getRankingData);

module.exports = router;
