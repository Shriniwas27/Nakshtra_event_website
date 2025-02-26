import express from "express";
import { signUp,login,addAdmin,addImage,voteImage } from "../controllers/usercontroller.js";
import auth from "../middlewares/auth.js";
import admincheck from "../middlewares/admincheck.js";
import { upload } from "../config/multerconfig.js";


const router=express.Router();

router.post("/signup",signUp);
router.post("/login",login);
router.post("/addadmin",admincheck,addAdmin);
router.post("/addimage", auth,upload.single("image"),addImage);
router.post("/voteimage/:id",auth,voteImage);


export default router;