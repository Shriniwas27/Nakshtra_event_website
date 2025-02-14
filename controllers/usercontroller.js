import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { SignupSchema,LoginSchema } from "../schemas/Zodschema.js";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

//signup controller
export const signup=async(req,res)=>{
    const validation= SignupSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({message:validation.error.issues[0].message})
    }
    const {name,email,password}=validation.data;
    const hashedPassword=await bcrypt.hash(password,10);
    try{
        const user=await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword
            }
        })
        return res.status(201).json({message:"User created successfully"})
    }catch(error){
        return res.status(500).json({message:"Error creating user"})
    }  
}

//signin controller
export const login=async(req,res)=>{
    const validation= LoginSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({message:validation.error.issues[0].message})
    }
    const {email,password}=validation.data;
    try{
        const user=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid password"})
        }
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"6h"});
        return res.status(200).json({message:"Login successful",token})
        
    }catch(error){
        return res.status(500).json({message:"Error logging in"})
    }   
}


export const addimages= async(req,res)=>{

}