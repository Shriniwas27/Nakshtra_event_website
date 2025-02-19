import express from "express";
import { validatePayment } from "../controllers/paymentcontroller.js";
import auth from "../middlewares/auth.js";
const router=express.Router();

router.post("/createorder",auth,validatePayment);

export default router;