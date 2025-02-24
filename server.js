import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import eventrouter from "./routes/eventroutes.js";
import paymentrouter from "./routes/paymentroutes.js";
import userrouter from "./routes/userroutes.js";
dotenv.config();
const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(helmet());



app.use("/api/user",userrouter);
app.use("/api/events",eventrouter);
app.use("/api/payment",paymentrouter);


app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})
