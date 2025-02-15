import express from "express";
import { validatepayment } from "../controllers/paymentcontroller.js";
import auth from "../middlewares/auth.js";
const router=express.Router();

router.post("/createorder",auth,validatepayment);

export default router;