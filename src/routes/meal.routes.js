const router = require("express").Router();
const { createMeal, getMeal } = require("../controller/meal.controller");

router.route("/").get(getMeal);
router.route("/create").post(createMeal);

module.exports = router;
