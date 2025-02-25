import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

//this is admin middleware
const admincheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Prisma.admin.findUnique({
      where: {
        id: decoded,
      },
    });
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.body.adminid = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication Error" });
  }
};