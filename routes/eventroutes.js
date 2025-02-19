import express from "express";
import { addEvent,deleteEventById,updateEventById,getAllEvents,getEventById,registerforEvent,prepareLeaderBoardforEvent,getAllImagesforEvent,getImageById } from "../controllers/eventcontroller.js";
import auth from "../middlewares/auth.js";
import upload from "../config/multerconfig.js";

const router=express.Router();

router.get("/all",auth,getAllEvents);
router.get("/event/:id",auth,getEventById);
router.post("/event",auth,upload.single("image"),addEvent);
router.delete("/event/:id",auth,deleteEventById);
router.put("/event/:id",auth,updateEventById);
router.get("/leaderboard/:id",auth,prepareLeaderBoardforEvent);
router.get("/images/:id",auth,getAllImagesforEvent);    
router.get("/image/:id",auth,getImageById);    
router.post("/register/:id",auth,registerforEvent); 


export default router;