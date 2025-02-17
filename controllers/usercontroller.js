import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignupSchema,LoginSchema} from "../schemas/Zodschema.js";
import jwt from "jsonwebtoken";

const Prisma=new PrismaClient();

export const signup=async(req,res)=>{
   const validation=SignupSchema.safeParse(req.body);
   if(validation.success){
       const {name,email,password}=validation.data;
       const hashedPassword=await bcrypt.hash(password,10);
       const user=await Prisma.user.create({
           data:{
               username:name,
               email:email,
               password:hashedPassword
           }
       })
       res.status(201).json({message:"User created successfully",user:user})
   }else{
       res.status(400).json({message:"Invalid data",validation:validation.error})
   }    
}

export const login=async(req,res)=>{
    const validation=LoginSchema.safeParse(req.body);
    if(!validation.success){
        res.status(400).json({message:"Invalid data",validation:validation.error})
    }
    const {email,password}=validation.data;
    const user=await Prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!user){
        res.status(404).json({message:"User not found"})
    }
    if(await bcrypt.compare(password,user.password)){
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"12h"});
        res.status(200).json({message:"Login successful",token:token})
    }else{
        res.status(401).json({message:"Invalid credentials"})
    }
}

export const addadmin=async(req,res)=>{
    const{email,username,password}= req.body;
    const validation= SignupSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({
            "message":"Validation Failed!"
        })
    }
    else{
        const hashpassword = await bcrypt.hash(password,10);
        const admin = Prisma.admin.create({
            data:{
                username:username,
                email:email,
                password:hashpassword,
            }
        })
        if(!admin){
            return res.json({
                "message":"Admin not created"
            })
        }else{
            return res.status(200).json({
                "Message":"Admin created successfully!"
            })
        }
    }
}

export const addimage=async(req,res)=>{
    try{
        const{userid, images}=req.body;

        const registereduser= Prisma.registration.findUnique({
            where:{
                userid:userid
            }
        })
        if(!registereduser){
            return res.status(404).json({
                "message":"User not found"
            })
        }
        else{
            const images = images.map(image=>{
                 Prisma.image.create({
                     data:{
                         image:image,
                         userid:userid
                     }
                 })
            })
            
            if(!images){
                return res.status(400).json({
                    "message":"Image not created"
                })
            }
            else{
                return res.status(200).json({
                    "message":"Images created successfully!"
                })
            }
        }

    }

    catch(error){
        console.log(error)
        return res.status(500).json({
            "message":"Internal server error"
        })
    }
}

export const vote=async(req,res)=>{
    try{
        const {imageid}=req.body;

         
        const image= Prisma.image.findUnique({
            where:{
                id:imageid
            },
            data:{
                votes:image.votes+1
            }
           
        })
        if(!image){
            return res.status(404).json({
                "message":"Image not found"
            })
        }
        else{
            return res.status(200).json({
                "message":"Image voted successfully!"
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            "message":"Internal server error"
        })
    }   
}





