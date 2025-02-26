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
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication Error" });
  }
};

export default admincheck;