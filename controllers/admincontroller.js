import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();


//this controller is used to get all event registrations, only admin can get all event registrations
export const getAllEventRegistration = async(req,res)=>{
    try{
        const {eventId}=req.params;
        const registrations = await Prisma.registration.findMany({
            where:{
                eventId:eventId
            }
        })
        return res.status(200).json({
            message:"All registrations fetched successfully",
            registrations:registrations
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}


//this controller is used to log all enteries to google sheets, only admin can log all enteries
export const logAlltoSheet=async(req,res)=>{
    try{
        const eventId = req.body.eventId;
        const registrations = await Prisma.registration.findMany({
            where:{
                eventId:eventId
            },
            include:{
                user:true,
                event:true
            }
        })

        const data = registrations.map(registration=>{
            return [registration.user.username,registration.event.name,registration.razorpay_payment_id,registration.razorpay_order_id,registration.razorpay_signature,registration.payment_status,registration.imagecount,registration.netvotes]
        })

        await writeToSheet(data);
        return res.status(200).json({
            message:"All registrations written to google sheets successfully"
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

