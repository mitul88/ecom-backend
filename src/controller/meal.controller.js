const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
module.exports.createMeal = async (req, res) => {
  const data = req.body;
  try {
    const meal = await prisma.menuItem.create({
      data: data,
    });
    return res.status(201).send({ message: "meal created", menu: meal });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "internal error occured" });
  }
};
module.exports.getMeal = async (req, res) => {};
