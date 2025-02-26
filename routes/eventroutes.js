import express from "express";
import { addEvent,deleteEventById,updateEventById,getAllEvents,getEventById,registerforEvent,prepareLeaderBoardforEvent,getAllImagesforEvent,getImageById } from "../controllers/eventcontroller.js";
import auth from "../middlewares/auth.js";
import admincheck from "../middlewares/admincheck.js";
import { upload } from "../config/multerconfig.js";

const router=express.Router();

router.get("/all",auth,getAllEvents);//tested
router.get("/event/:id",auth,getEventById);///tested
router.post("/event",admincheck,upload.single("image"),addEvent);
router.delete("/event/:id",admincheck,deleteEventById);
router.put("/event/:id",admincheck,updateEventById);
router.get("/leaderboard/:id",auth,prepareLeaderBoardforEvent);//tested
router.get("/images",auth,getAllImagesforEvent);  //tested  
router.get("/image/:id",auth,getImageById);   
router.post("/register",auth,registerforEvent); 


export default router;