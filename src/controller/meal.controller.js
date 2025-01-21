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
module.exports.getMeal = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const orderBy = req.query.orderBy || "desc";
  try {
    const menus = await prisma.menuItem.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        created_at: true,
      },
      take: parseInt(limit),
      skip: (page - 1) * limit,
      orderBy: {
        created_at: orderBy,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "internal error occured" });
  }
};
