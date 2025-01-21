const router = require("express").Router();
const {
  signup,
  login,
  refreshTokenHandler,
} = require("../controller/auth.controller");

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/refresh-token").get(refreshTokenHandler);

module.exports = router;
