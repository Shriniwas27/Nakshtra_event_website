import { PrismaClient } from "@prisma/client";
import xlsx from "xlsx";
const Prisma = new PrismaClient();




//this controller is used to log all enteries to google sheets, only admin can log all enteries
export const logAlltoSheet=async(req,res)=>{
    try{
        const eventId = parseInt(req.params.eventId);
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
            message:"All registrations written to google sheets successfully",
            registrations:registrations
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}


export const endEvent=async(req,res)=>{
    try{
        const eventId=parseInt(req.params.id);
        console.log(eventId);
        const event = await Prisma.event.update({
            where:{
                id:eventId
            },
            data:{
                eventEnded:true
            }
        })
      
       return res.status(200).json({
            message:"Event ended successfully"  
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}


export const downloadLeaderboard = async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
  
      const images = await Prisma.image.findMany({
        where: { eventId: eventId },
        include: { Registration: true },
      });
  
      if (!images.length) {
        return res.status(404).json({ message: "No leaderboard data found" });
      }
  
      const leaderboard = images.sort((a, b) => b.votes - a.votes);
  
      
      const users = await Promise.all(
        leaderboard.map((image) =>
          Prisma.user.findUnique({
            where: { id: image.Registration.userId },
          })
        )
      );
  
      const leaders = leaderboard.map((image, index) => ({
        Rank: index + 1,
        Username: users[index]?.username || "Unknown",
        Email: users[index]?.email || "Unknown",
        Votes: image.votes,
        ImageURL: image.url, 
      }));
  
      console.log(leaders);
      const ws = xlsx.utils.json_to_sheet(leaders);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Leaderboard");
  
    
      const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });
  
      
      res.setHeader("Content-Disposition", "attachment; filename=leaderboard.xlsx");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      console.log(buffer);  
      res.send(buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
};


export const sendnotification=async(req,res)=>{
    try{
        const eventId=parseInt(req.params.eventId);
    const registrations = await Prisma.registration.findMany({
        where:{
            eventId:eventId
        },
        include:{
            user:true,
        }
    })

    registrations.forEach(registration=>{
        const user=registration.user;
        sendMail(user.email,"Welcome to PICT NAKSHTRA",`Your registration for ${registration.event.name} has been confirmed. Please vote for your favourite image.`);
    })

    return res.status(200).json({
        message:"All registrations sent successfully"
    })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}


