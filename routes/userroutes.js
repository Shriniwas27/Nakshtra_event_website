import express from "express";
import { signUp,login,addAdmin,addImage,voteImage,verifyuser } from "../controllers/usercontroller.js";
import { downloadLeaderboard ,sendnotification, logAlltoSheet, endEvent} from "../controllers/admincontroller.js";
import auth from "../middlewares/auth.js";
import admincheck from "../middlewares/admincheck.js";
import { upload } from "../config/multerconfig.js";

const router=express.Router();

router.post("/signup",signUp);//tested
router.post("/login",login);//tested
router.post("/addadmin",admincheck,addAdmin);//tested
router.post("/addimage", upload.single("image"),addImage);//tested
router.post("/voteimage/:id",voteImage);//tested
router.get("/verify/:token",auth,verifyuser);
router.get("/downloadleaderboard/:id",downloadLeaderboard);//tested
router.post("/sendnotification/:id",sendnotification);
router.post("/end/:id",endEvent);//tested
router.post("/logtoallsheet/:id",admincheck,logAlltoSheet);

export default router;
