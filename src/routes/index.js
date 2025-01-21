const authRouter = require("./auth.routes");

module.exports = (app) => {
  app.use("v1/api/auth", authRouter);
};
