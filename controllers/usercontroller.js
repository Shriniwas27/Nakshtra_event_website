import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignupSchema, LoginSchema } from "../schemas/Zodschema.js";
import jwt from "jsonwebtoken";
import sendMail from "../services/mailservice.js";



const Prisma = new PrismaClient();

//this contoller is used for signing up in web application, for authentication
export const signUp = async (req, res) => {
  try {
    const validation = SignupSchema.safeParse(req.body);
    console.log(validation);
    if (validation) {
      const { name, email, password } = validation.data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const  alreadyuser= await Prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if(alreadyuser){
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await Prisma.user.create({
        data: {
          username: name,
          email: email,
          password: hashedPassword,
          isverified:false,
          verificationtoken:token
        },
      });
      
       const token = jwt.sign(user.id, process.env.JWT_SECRET_USER,{expiresIn:"6h"});
       sendMail(email,"Welcome to PICT NAKSHTRA",`Your account has been created successfully. Please verify your email to activate your account. Click on the link below to verify your account.\n\n${process.env.CLIENT_URL}/verify/${token}`);
      res
        .status(200)
        .json({ message: "User created successfully", user: user });

        
    }else{
      return res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error });
  }
};

//this controller is used for login in web application, for authentication
export const login = async (req, res) => {
  try {
  
    const validation = LoginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid data", validation: validation.error });
    }

    const { email, password, isadmin } = validation.data;

   
    const userType = isadmin ? "admin" : "user";
    const user = await Prisma[userType].findUnique({ where: { email } });

    if(userType === "user" && !user.isverified){
      return res.status(401).json({message:"Please verify your account before logging in!"})
    }

    if (!user) {
      return res.status(404).json({ message: `${userType} not found` });
    }

   
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const secret = isadmin ? process.env.JWT_SECRET_ADMIN : process.env.JWT_SECRET_USER;
    const token = jwt.sign({ id: user.id }, secret);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await Prisma.$disconnect(); 
  }
};

//this controller is used for adding admin in web application, only admin can add admin
export const addAdmin = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const validation = SignupSchema.safeParse(req.body);
  
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation Failed!",
      });
    } else {
      const hashpassword = await bcrypt.hash(password, 10);
     const admin= await Prisma.admin.create({ 
        data: { 
          username: name, 
          email: email,
          password: hashpassword,
        }
      });
  
      if (!admin) {
        return res.json({
          message: "Admin not created",
        });
      } else {
        return res.status(200).json({
          Message: "Admin created successfully!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//this controller is used for adding image in web application, all users can add image
export const addImage = async (req, res) => {
  try {
   
    const eventId = req.body.eventId ? parseInt(req.body.eventId, 10) : null;
    const registrationId = req.body.registrationId ? parseInt(req.body.registrationId, 10) : null;
     console.log(req.body);
     console.log(req.file);


    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({ message: "Event ID is required and must be a number" });
    }

  
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = req.file.path;
    console.log("Uploaded Image URL:", imageUrl);

    console.log(registrationId);
    const registeredUser = await Prisma.registration.findUnique({
      where: { id: registrationId },
      select: { imagecount: true, id: true },
    });

    console.log(registeredUser);
    if (!registeredUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (registeredUser.imagecount >= 3) {
      return res.status(400).json({ message: "You can't add more than 3 images" });
    }

    const image = await Prisma.image.create({
      data: {
        url: imageUrl,
        eventId: eventId, 
        RegistrationId: registrationId,
        voterecord:[]
      },
    });

    console.log(image);
    await Prisma.registration.update({
      where: { id: registrationId },
      data: { imagecount: registeredUser.imagecount + 1 },
    });
    console.log(registeredUser);
    return res.status(201).json({ message: "Image added successfully!", image });

  } catch (error) {
    
    return res.status(500).json({ message: "Internal server error" });
  }
};


//this controller is ued for voting, all users can vote
export const voteImage = async (req, res) => {
  try {
    const imageId = parseInt(req.params.id);
    const userId= req.body.userId;

    const image = await Prisma.image.findUnique({
      where: { id: imageId },
      select: { votes: true, voterecord: true },
    });
    console.log(image);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (image.voterecord.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already voted for this image" });
    }
    console.log(image.voterecord.includes(userId));
    await Prisma.image.update({
      where: { id: imageId },
      data: {
        votes: image.votes + 1,
        voterecord: [...image.voterecord, userId],
      },
    }).then(console.log(image));
     
    return res.status(200).json({ message: "Image voted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


//route remaining to be added  
export const verifyuser= async(req,res)=>{
  const token=req.params.token;
  try{
    const user=await Prisma.user.findUnique({
      where:{
        verificationtoken:token
      }
    })
    if(user){

      await Prisma.user.update({
        where:{
          id:user.id
        },
        data:{
          isverified:true,
          verificationtoken:""
        }
      })
      sendMail(user.email,"Welcome to PICT NAKSHTRA",`Your account has been verified successfully. Please login to your account.`);
      return res.status(200).json({message:"Account verified successfully!"})
    }
    else{
      return res.status(404).json({message:"Account not found!"})
    }
  }catch(error){
    return res.status(500).json({message:"Internal server error"})
  }
}