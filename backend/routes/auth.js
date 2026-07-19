const router = require("express").Router();
const { login, register, forgotPassword, resetPassword, verifyEmail } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);

module.exports = router;
