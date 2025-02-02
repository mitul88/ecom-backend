const bcrypt = require("bcrypt");

module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports.validatePassword = async (incomingPass, hashedPass) => {
  return await bcrypt.compare(incomingPass, hashedPass);
};
