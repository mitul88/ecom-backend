const authRouter = require("./auth.routes");
const mealRouter = require("./meal.routes");

module.exports = (app) => {
  app.use("/v1/api/auth", authRouter);
  app.use("/v1/api/meal", mealRouter);
};
