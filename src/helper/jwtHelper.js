const jwt = require("jsonwebtoken");

module.exports.generateJWT = function (userData, expiry) {
  const token = jwt.sign(
    {
      _id: userData["id"],
      email: userData["email"],
      name: userData["name"],
    },
    process.env.JWT_SECRET,
    { expiresIn: expiry }
  );

  return token;
};

module.exports.jwtVerify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
