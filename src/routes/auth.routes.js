const router = require("express").Router();
const {
  signup,
  login,
  refreshTokenHandler,
  logout,
} = require("../controller/auth.controller");

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/refresh-token").get(refreshTokenHandler);

module.exports = router;
