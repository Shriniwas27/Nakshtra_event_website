import express from "express";
import { signup,login,addadmin } from "../controllers/usercontroller.js";
import auth from "../middlewares/auth.js";
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);   
router.post("/addadmin",auth,addadmin); 

export default router;