const { PrismaClient } = require("@prisma/client/extension");
const { hashPassword } = require("../helper/password.helper");

const prisma = new PrismaClient();

module.exports.login = async (req, res) => {};
module.exports.signup = async (req, res) => {
  const data = req.body;
  if (!data["email"] || !data["password"] || !data["name"] || !data["phone"]) {
    return res.status(422).send({
      status: false,
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
      return res
        .status(404)
        .send({ status: "fail", message: "Email already exists" });
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
    return res.status(201).send({
      message: "User created",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "internal error occered",
    });
  }
};
