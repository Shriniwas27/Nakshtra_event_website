import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignupSchema, LoginSchema } from "../schemas/Zodschema.js";
import jwt from "jsonwebtoken";


const Prisma = new PrismaClient();

//this contoller is used for signing up in web application, for authentication
export const signUp = async (req, res) => {
  try {
    const validation = SignupSchema.safeParse(req.body);
    if (validation.success) {
      const { username, email, password } = validation.data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
        },
      });
      res
        .status(200)
        .json({ message: "User created successfully", user: user });
    } else {
      res
        .status(400)
        .json({ message: "Invalid data", validation: validation.error });
    }
  } catch (error) {
    if(error.code === 'P2002'){
      return res.status(409).json({message:`Unique constraint failed on ${error.meta.target}`},)
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//this controller is used for login in web application, for authentication
export const login = async (req, res) => {
  try {
    const validation = LoginSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid data", validation: validation.error });
    }
    const { email, password ,isAdmin } = validation.data;

    if(isAdmin){
      const admin = await Prisma.admin.findUnique({
        where: {
          email: email,
        },
      });
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (await bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET_ADMIN);
        return res.status(200).json({ message: "Login successful", token: token });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    else{
      const user = await Prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Login successful", token: token });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//this controller is used for adding admin in web application, only admin can add admin
export const addAdmin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const validation = SignupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation Failed!",
      });
    } else {
      const hashpassword = await bcrypt.hash(password, 10);
      const admin = Prisma.admin.create({
        data: {
          username: username,
          email: email,
          password: hashpassword,
        },
      });
      if (!admin) {
        return res.status(400).json({
          message: "Admin not created",
        });
      } else {
        return res.status(200).json({
          message: "Admin created successfully!"
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
    const userId = req.body.userId ? parseInt(req.body.userId, 10) : null;
    const eventId = req.body.eventId ? parseInt(req.body.eventId, 10) : null;


    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "User ID is required and must be a number" });
    }

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({ message: "Event ID is required and must be a number" });
    }

  
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = req.file.path;
    console.log("Uploaded Image URL:", imageUrl);


    const registeredUser = await Prisma.registration.findUnique({
      where: { id: userId },
      select: { imagecount: true },
    });

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
        RegistrationId: userId, 
      },
    });

    await Prisma.registration.update({
      where: { id: userId },
      data: { imagecount: registeredUser.imagecount + 1 },
    });

    return res.status(201).json({ message: "Image added successfully!", image });

  } catch (error) {
    
    return res.status(500).json({ message: "Internal server error" });
  }
};


//this controller is ued for voting, all users can vote
export const voteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { userId } = req.body;

    const image = await Prisma.image.findUnique({
      where: { id: imageId },
      select: { votes: true, voterecord: true },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (image.voterecord.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already voted for this image" });
    }

    await Prisma.image.update({
      where: { id: imageId },
      data: {
        votes: image.votes + 1,
        voterecord: { push: userId },
      },
    });
    return res.status(200).json({ message: "Image voted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
