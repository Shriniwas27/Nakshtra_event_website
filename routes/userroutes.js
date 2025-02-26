import express from "express";
import { signUp,login,addAdmin,addImage,voteImage } from "../controllers/usercontroller.js";
import auth from "../middlewares/auth.js";
import admincheck from "../middlewares/admincheck.js";
import { upload } from "../config/multerconfig.js";


const router=express.Router();

router.post("/signup",signUp);
router.post("/login",login);
router.post("/addAdmin",admincheck,addAdmin);
router.post("/addImage", auth,upload.single("image"),addImage);
router.post("/voteImage/:id",auth,voteImage);


export default router;