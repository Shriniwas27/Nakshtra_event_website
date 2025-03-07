import { PrismaClient } from "@prisma/client";
import { addEventSchema } from "../schemas/Zodschema.js";
import { createOrder } from "./paymentcontroller.js";
import sendMail from "../services/mailservice.js";
const Prisma = new PrismaClient();


//this controller is used to add event, only admin can add event
export const addEvent = async (req, res) => {
  try {
    const { name, description} = req.body;
    const price = parseInt(req.body.price);
    const adminid = parseInt(req.body.adminId)

    
    if (isNaN(price)) {
      return res.status(400).json({ message: "Invalid price format" });
    }


    const admin = await Prisma.admin.findUnique({ where: { id:adminid} });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

 
    const image = req.file ? req.file.path : null;

    const event = await Prisma.event.create({
      data: {
        name,
        description,
        price,
        image,
        adminId: adminid, 
        eventEnded: false, 
      },
    });

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



//this controller is used to delete event by id, only admin can delete event
export const deleteEventById = async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      await Prisma.event.delete({
        where: {
          id: eventId,
        },
      });

      return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
};
  
  
  //this controller is used to update event by id, only admin can update event
export const updateEventById = async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const validation = addEventSchema.safeParse(req.body);
      const image = req.file ? req.file.path : null;
      if (!validation.success) {
      return res.status(400)
                .json({ message: "Invalid data", validation: validation.error });
      }
      const { name, description } = req.body;
      const price = parseInt(req.body.price);
      
      const event = await Prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          name: name,
          description: description,
          price: price,
          image: image,
        },
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res
        .status(200)
        .json({ message: "Event updated successfully", event: event });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
};

  
//this controller is used to get all events,all users can get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Prisma.event.findMany();
    return res.status(200).json({ message: "All events", events: events });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


//this controller is used to get event by id, all users can get event by id
export const getEventById = async (req, res) => {
  try {
    const  eventId  = parseInt(req.params.id);
    const event = await Prisma.event.findUnique({ where: { id: eventId } });
    
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
   return res.status(200).json({ message: "Event found", event: event });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


//this controller is used to register for event, all users can register for event
export const registerforEvent = async (req, res) => {
  try {
    const  eventId  = parseInt(req.body.eventId);
    const  userId  = parseInt(req.body.userId);

  
    const event = await Prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

   
    const user = await Prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const alreadyRegistered = await Prisma.registration.findFirst({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });

    if (alreadyRegistered) {
      return res.status(400).json({ message: "User already registered for event" });
    }

    
    let order = await createOrder(event.price, user, event);

   
    const registration = await Prisma.registration.create({
      data: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connect: { id: userId }, 
        },
        payment_status: "PENDING",
        netvotes: 0,
        imagecount: 0,
        razorpay_payment_id: "",
        razorpay_order_id: "",

      },
    });
    
    
    return res.status(201).json({
      message: "Registration created successfully",
      registration,
      order:order,
    });

  } catch (error) {
    console.error("Error registering for event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



//this controller is used to prepare leaderboard for event, all user can access leaderboard for event
export const prepareLeaderBoardforEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const registrations = await Prisma.image.findMany({
      where: {
        eventId: eventId,
      },
    });
    const rankascending = registrations.sort((a, b) => a.votes - b.votes);
    return res.status(200).json({
      message: "Leaderboard prepared successfully",
      rankascending: rankascending,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


//this controller is used to get all images for event, all users can get all images for event
export const getAllImagesforEvent = async(req,res)=>{
try {
    const eventId = parseInt(req.params.id);
    const images = await Prisma.image.findMany({
        where:{
            eventId:eventId
        }
    })
    return res.status(200).json({
        message:"All images fetched successfully",
        images:images
    })
} catch (error) {
    return res.status(500).json({
        message:"Internal server error"
    })
}
}

//this controller is used to get image by id, all users can get image by id
export const getImageById = async(req,res)=>{
try {
    const imageId = parseInt(req.params.id);
    const image = await Prisma.image.findUnique({
        where:{
            id:imageId
        }
    })
    return res.status(200).json({
        message:"Image fetched successfully",
        image:image
    })
} catch (error) {
    return res.status(500).json({
        message:"Internal server error"
    })
}
}