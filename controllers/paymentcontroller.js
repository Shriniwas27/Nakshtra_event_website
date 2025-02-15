import { Prisma } from "@prisma/client";
import { razorpay } from "../config/razorpay.js";
import crypto from "crypto";

//order function
export const createorder=(amount,user,event)=>{
   const options={
    amount:amount*100,
    currency:"INR",
    receipt:`user ${user.email}`,
    description:`Event ${event.name}`,
   }

   const order = razorpay.orders.create(options);
   return order;
}


//payment validation controller
export const validatepayment=async(req,res)=>{
    
    const {order_id, payment_id, signature,registration_id} = req.body;

    const generatesignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(order_id)
        .digest("hex");

        if (generatesignature !== signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }
        else{
            const registration = await Prisma.Registration.findUnique({
                where:{
                    registration_id:registration_id
                }
            })

            if(!registration){
                return res.status(404).json({message:"Registration not found"})
            }
            const updatedregistration = await Prisma.Registration.update({
                where:{
                    registration_id:registration_id
                },
                data:{
                    razorpay_payment_id:payment_id,
                    razorpay_order_id:order_id,
                    razorpay_signature:signature,
                    payment_status:"PAID"
                }
            })
            return res.status(200).json({message:"Payment validated successfully"})
        }


}