import express from "express";
import { addEvent,deleteEventById,updateEventById,getAllEvents,getEventById,registerforEvent,prepareLeaderBoardforEvent,getAllImagesforEvent,getImageById } from "../controllers/eventcontroller.js";
import auth from "../middlewares/auth.js";
import admincheck from "../middlewares/admincheck.js";
import { upload } from "../config/multerconfig.js";

const router=express.Router();

router.get("/all",auth,getAllEvents);//tested
router.get("/event/:id",auth,getEventById);///tested
router.post("/event",upload.single("image"),addEvent);
router.delete("/event/:id",deleteEventById);//tested
router.put("/event/:id",updateEventById);
router.get("/leaderboard/:id",auth,prepareLeaderBoardforEvent);//tested
router.get("/images",auth,getAllImagesforEvent);  //tested  
router.get("/image/:id",getImageById);   //tested
router.post("/register",auth,registerforEvent); 


export default router;