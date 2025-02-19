import { PrismaClient } from "@prisma/client";
import { razorpay } from "../config/razorpay.js";
import crypto from "crypto";

const Prisma = new PrismaClient();

//this function is used to create order, it is used in registerforEvent controller
export const createOrder = async (amount, user, event) => {
  try {
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        userEmail: user.email,
        eventName: event.name,
      },
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create order");
  }
};



//this controller is used to validate payment and updates registration status
export const validatePayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature, registration_id } = req.body;

  
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    if (generatedSignature !== signature) {
     
      await prisma.order.update({
        where: { id: order_id },
        data: {
          razorpay_payment_id: payment_id,
          razorpay_order_id: order_id,
          payment_status: "FAILED",
        },
      });

      return res.status(400).json({ message: "Invalid signature" });
    }

  
    const registration = await prisma.registration.findUnique({
      where: { id: registration_id },
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

  
    await prisma.registration.update({
      where: { id: registration_id },
      data: {
        razorpay_payment_id: payment_id,
        razorpay_order_id: order_id,
        razorpay_signature: signature,
        payment_status: "PAID",
      },
    });

    return res.status(200).json({ message: "Payment validated successfully" });

  } catch (error) {
    console.error("Payment validation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

