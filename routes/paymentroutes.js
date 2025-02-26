import express from "express";
import { validatePayment } from "../controllers/paymentcontroller.js";
import auth from "../middlewares/auth.js";
const router=express.Router();

router.post("/validatepayment",auth,validatePayment);

export default router;