const { PrismaClient } = require("@prisma/client");
const { hashPassword, validatePassword } = require("../helper/password.helper");
const { generateJWT, jwtVerify } = require("../helper/jwtHelper");
const _ = require("lodash");

const prisma = new PrismaClient();

module.exports.login = async (req, res) => {
  const data = req.body;
  try {
    if (
      !data["email"] ||
      data["email"] == "" ||
      !data["password"] ||
      data["password"] == ""
    ) {
      return res.status(422).send({
        message: "email and password needed",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data["email"],
      },
    });
    if (!user) {
      return res.status(404).send({ message: "email not found" });
    }

    // verify user
    const validUser = await validatePassword(data["password"], user.password);
    if (!validUser) {
      return res.status(401).send({ message: "incorrect password" });
    }

    // send token if password is correct
    const token = generateJWT(
      _.pick(user, ["id", "email", "name", "phone"]),
      process.env.JWT_EXPIRATION
    );

    const refreshToken = generateJWT(
      {
        ..._.pick(user, ["id", "name", "email", "phone"]),
        tokenId: process.env.REFRESH_TOKEN_ID,
        iat: Date.now(),
        exp: process.env.REFRESH_TOKEN_EXPIRATION,
      },
      process.env.REFRESH_TOKEN_EXPIRATION
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return res.status(200).send({ message: "login successful", token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "internal error occured" });
  }
};

module.exports.signup = async (req, res) => {
  const data = req.body;
  if (
    !data["email"] ||
    data["email"] == "" ||
    !data["password"] ||
    data["password"] == "" ||
    !data["name"] ||
    data["name"] == "" ||
    !data["phone"] ||
    data["phone"] == ""
  ) {
    return res.status(422).send({
      message: "Please fill up required information",
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data["email"],
      },
    });

    if (user) {
      return res.status(404).send({ message: "Email already exists" });
    }
    const hashedPassword = await hashPassword(data["password"]);
    await prisma.user.create({
      data: {
        name: data["name"],
        phone: data["phone"],
        email: data["email"],
        password: hashedPassword,
      },
    });

    // send token after registration
    const token = generateJWT(
      _.pick(user, ["id", "email", "name", "phone"]),
      process.env.JWT_EXPIRATION
    );

    const refreshToken = generateJWT(
      {
        ..._.pick(user, ["id", "name", "email", "phone"]),
        tokenId: process.env.REFRESH_TOKEN_ID,
        iat: Date.now(),
        exp: process.env.REFRESH_TOKEN_EXPIRATION,
      },
      process.env.REFRESH_TOKEN_EXPIRATION
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return res.status(201).send({
      message: "User created",
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "internal error occered",
    });
  }
};

module.exports.refreshTokenHandler = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).send({ message: "refresh token missing" });
  }

  try {
    const payload = jwtVerify(refreshToken);
    const token = generateJWT(
      {
        ...payload,
        tokenId: process.env.REFRESH_TOKEN_ID,
        iat: Date.now(),
        exp: process.env.JWT_EXPIRATION,
      },
      process.env.JWT_EXPIRATION
    );
    return res.status(200).send({ message: "new access token fetched", token });
  } catch (error) {
    return res.status(403).send({ message: "invalid refresh token" });
  }
};
