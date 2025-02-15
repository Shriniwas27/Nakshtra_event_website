import { PrismaClient } from "@prisma/client";
import { addEventSchema } from "../schemas/Zodschema.js";
import { createorder } from "./paymentcontroller.js";

const Prisma=new PrismaClient();

//add event controller
export const addevent=async(req,res)=>{
    const validation=addEventSchema.safeParse(req.body);
    if(!validation.success){
        res.status(400).json({message:"Invalid data",validation:validation.error})
    }
    const {name,description,price,image}=validation.data;
    const event=await Prisma.Event.create({
        data:{
            name:name,
            description:description,
            price:price,
            image:image
        }
    })
    res.status(201).json({message:"Event created successfully",event:event})    
}


//get all events controller
export const getallevents=async(req,res)=>{
    const events=await Prisma.Event.findMany()
    res.status(200).json({message:"All events",events:events})
}


//get event by id controller
export const getEventById=async(req,res)=>{
    const {id}=req.params;
    const event=await Prisma.Event.findUnique({
        where:{
            id:id
        }
    })
    if(!event){
        res.status(404).json({message:"Event not found"})
    }
    res.status(200).json({message:"Event found",event:event})
}


//deletebyeventid controller
export const deleteEventById=async(req,res)=>{
    const {id}=req.params;
    const event=await Prisma.Event.delete({
        where:{
            id:id
        }
    })
    if(!event){
        res.status(404).json({message:"Event not found"})
    }
    res.status(200).json({message:"Event deleted successfully"})
}


//updatebyeventid controller
export const updateEventById=async(req,res)=>{
    const {id}=req.params;
    const validation=addEventSchema.safeParse(req.body);
    if(!validation.success){
        res.status(400).json({message:"Invalid data",validation:validation.error})
    }
    const {name,description,price,image}=validation.data;
    const event=await Prisma.Event.update({
        where:{
            id:id
        },
        data:{
            name:name,
            description:description,
            price:price,
            image:image
        }
    })
    if(!event){
        res.status(404).json({message:"Event not found"})
    }
    res.status(200).json({message:"Event updated successfully",event:event})
}


//registration 
export const registerforEvent=async(req,res)=>{
   const {eventid, userid}= req.body;
   const event = Prisma.event.findUnique({
       where:{
           id:eventid
       }
   }) 
   const user = Prisma.user.findUnique({    
    where:{
        id:userid
    }
    })
     
    const order = createorder(event.price,user,event);
    const registration = await Prisma.registration.create({
        data:{
            eventId:event.id,
            userId:user.id,
            payment_status:"PENDING" 
        }
    })
   
    return res.status(201).json({message:"Registration created successfully",registration:registration,order:order})
    
}



