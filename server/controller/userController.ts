import Users from "../models/userModal";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";


const registerUser = async(req: Request, res: Response) => {
    try{
        const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: "Please fill all fields"});
    }
    const user = await Users.findOne({email});
    if(user){
        return res.status(400).json({message: "User already exists"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await Users.create({name, email, password: hashedPassword});
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET!, {expiresIn: "1h"});
    res.status(201).json({
        success: true,
        data: newUser,
        token: token,
    });
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
    
}


const loginUser = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please fill all fields"});
        }
        const user = await Users.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {expiresIn: "1h"});
        res.status(200).json({
            success: true,
            data: user,
            token: token,
        });
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

const logoutUser = async(req: Request, res: Response) => {
    try{
        res.clearCookie("token");
        res.status(200).json({message: "Logged out successfully"});

    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}


export {registerUser, loginUser, logoutUser};
