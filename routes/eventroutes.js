import express from "express";
import { addevent,getallevents,getEventById,deleteEventById,updateEventById,registerforEvent } from "../controllers/eventcontroller.js";
import auth from "../middlewares/auth.js";

const router=express.Router();

router.get("/allevents",auth,getallevents);
router.get("/event/:id",auth,getEventById);
router.delete("/event/:id",auth,deleteEventById);
router.put("/event/:id",auth,updateEventById);
router.post("/event",auth,addevent);
router.post("/register",auth,registerforEvent);

export default router;